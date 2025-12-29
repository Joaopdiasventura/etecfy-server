import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateSongChunkDto } from '../../../core/song-chunk/dto/create-song-chunk.dto';
import type { FileStorageProvider } from './providers';

@Injectable()
export class FileService {
  private storage: FileStorageProvider;

  public constructor(
    private readonly configService: ConfigService,
    @Inject('DevelopmentStorage')
    private readonly developmentStorage: FileStorageProvider,
    @Inject('ProductionStorage')
    private readonly productionStorage: FileStorageProvider,
  ) {
    this.storage =
      this.configService.get<string>('env') == 'production'
        ? this.productionStorage
        : this.developmentStorage;
  }

  public async upload(file: Express.Multer.File): Promise<string> {
    return this.storage.upload(file);
  }

  public async delete(url: string): Promise<void> {
    return this.storage.delete(url);
  }

  public getAudioDuration(file: Express.Multer.File): number {
    try {
      if (!file || !file.buffer)
        throw new BadRequestException('Arquivo inválido');
      if (!this.isLikelyMp3(file.buffer))
        throw new BadRequestException('Arquivo de música inválido');
      const { frames, totalDuration } = this.parseMp3Frames(file.buffer);
      if (!frames.length || !isFinite(totalDuration) || totalDuration <= 0)
        throw new BadRequestException('Arquivo de música inválido');
      return Math.floor(totalDuration);
    } catch (error) {
      Logger.error(error, 'FileService.getAudioDuration');
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(
        'Erro ao receber a duração do arquivo',
      );
    }
  }

  public async uploadMusicInChunks(
    song: number,
    file: Express.Multer.File,
  ): Promise<CreateSongChunkDto[]> {
    try {
      if (!file || !file.buffer)
        throw new BadRequestException('Arquivo inválido');
      if (!this.isLikelyMp3(file.buffer))
        throw new BadRequestException('Arquivo de música inválido');
      const chunkSizeSeconds =
        this.configService.get<number>('chunkSizeSeconds') ?? 10;
      const { frames, totalDuration } = this.parseMp3Frames(file.buffer);
      if (!frames.length || !isFinite(totalDuration) || totalDuration <= 0)
        throw new BadRequestException('Arquivo de música inválido');
      const out: CreateSongChunkDto[] = [];
      let i = 0;
      let idx = 0;
      while (i < frames.length) {
        const startOffset = frames[i].offset;
        let endOffset = startOffset;
        let acc = 0;
        let j = i;
        while (j < frames.length && acc < chunkSizeSeconds) {
          acc += frames[j].duration;
          endOffset = frames[j].offset + frames[j].length;
          j++;
        }
        const segment = Buffer.from(
          file.buffer.subarray(startOffset, endOffset),
        );
        const fakeFile: Express.Multer.File = {
          ...file,
          buffer: segment,
          size: segment.length,
          mimetype: 'audio/mpeg',
          originalname: `${song}-${String(idx).padStart(5, '0')}.mp3`,
        };
        const url = await this.storage.upload(fakeFile);
        out.push({
          url,
          song,
          duration:
            Math.min(
              chunkSizeSeconds,
              Math.max(
                0,
                totalDuration -
                  ((startOffset - frames[0].offset) /
                    (endOffset - startOffset)) *
                    acc,
              ),
            ) || acc,
        });
        idx++;
        i = j;
      }
      return out;
    } catch (error) {
      Logger.error(error, 'FileService.uploadMusicInChunks');
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(
        'Erro ao processar chunks do áudio',
      );
    }
  }

  private isLikelyMp3(buffer: Buffer): boolean {
    if (buffer.length < 4) return false;
    if (buffer.subarray(0, 3).toString('ascii') == 'ID3') return true;
    const b1 = buffer[0];
    const b2 = buffer[1];
    return b1 == 0xff && (b2 & 0xe0) == 0xe0;
  }

  private readSyncSafeInt(b: Buffer, o: number): number {
    return (b[o] << 21) + (b[o + 1] << 14) + (b[o + 2] << 7) + b[o + 3];
  }

  private parseMp3Frames(buffer: Buffer): {
    frames: Array<{ offset: number; length: number; duration: number }>;
    totalDuration: number;
  } {
    let i = 0;
    if (buffer.length < 4) return { frames: [], totalDuration: 0 };
    if (
      buffer.subarray(0, 3).toString('ascii') == 'ID3' &&
      buffer.length >= 10
    ) {
      const size = this.readSyncSafeInt(buffer, 6);
      i = 10 + size;
      if (i > buffer.length) i = 0;
    }
    const brTableMpeg1L3 = [
      0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320, 0,
    ];
    const brTableMpeg2L3 = [
      0, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160, 0,
    ];
    const srTableMpeg1 = [44100, 48000, 32000];
    const srTableMpeg2 = [22050, 24000, 16000];
    const srTableMpeg25 = [11025, 12000, 8000];
    const frames: Array<{ offset: number; length: number; duration: number }> =
      [];
    let total = 0;
    let guard = 0;
    while (i + 4 <= buffer.length && guard < 200000) {
      guard++;
      const b1 = buffer[i];
      const b2 = buffer[i + 1];
      const b3 = buffer[i + 2];
      if (!(b1 == 0xff && (b2 & 0xe0) == 0xe0)) {
        i++;
        continue;
      }
      const versionId = (b2 >> 3) & 0x03;
      const layer = (b2 >> 1) & 0x03;
      const bitrateIdx = (b3 >> 4) & 0x0f;
      const sampleRateIdx = (b3 >> 2) & 0x03;
      const padding = (b3 >> 1) & 0x01;
      if (
        layer !== 0x01 ||
        sampleRateIdx == 0x03 ||
        bitrateIdx == 0x0f ||
        bitrateIdx == 0x00
      ) {
        i++;
        continue;
      }
      let sr = 0;
      if (versionId == 0x03) sr = srTableMpeg1[sampleRateIdx];
      else if (versionId == 0x02) sr = srTableMpeg2[sampleRateIdx];
      else if (versionId == 0x00) sr = srTableMpeg25[sampleRateIdx];
      else {
        i++;
        continue;
      }
      const br =
        versionId == 0x03
          ? brTableMpeg1L3[bitrateIdx]
          : brTableMpeg2L3[bitrateIdx];
      if (!sr || !br) {
        i++;
        continue;
      }
      const spf = versionId == 0x03 ? 1152 : 576;
      const coeff = versionId == 0x03 ? 144000 : 72000;
      const frameLen = Math.floor((coeff * br) / sr + padding);
      if (frameLen <= 0 || i + frameLen > buffer.length) {
        i++;
        continue;
      }
      const dur = spf / sr;
      frames.push({ offset: i, length: frameLen, duration: dur });
      total += dur;
      i += frameLen;
    }
    return { frames, totalDuration: total };
  }
}
