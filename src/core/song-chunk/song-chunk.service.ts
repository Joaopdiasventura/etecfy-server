import { Inject, Injectable } from '@nestjs/common';
import { SongChunk } from './entities/song-chunk.entity';
import { CreateSongChunkDto } from './dto/create-song-chunk.dto';
import type { ISongChunkRepository } from './repositories/song-chunk.repository';

@Injectable()
export class SongChunkService {
  public constructor(
    @Inject('ISongChunkRepository')
    private readonly songChunkRepository: ISongChunkRepository,
  ) {}

  public createMany(songChunks: CreateSongChunkDto[]): Promise<void> {
    return this.songChunkRepository.createMany(songChunks);
  }

  public findAllBySong(song: string): Promise<SongChunk[]> {
    return this.songChunkRepository.findAllBySong(song);
  }
}
