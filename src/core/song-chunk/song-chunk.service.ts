import { Injectable } from '@nestjs/common';
import { SongChunk } from './entities/song-chunk.entity';
import { ISongChunkRepository } from './repositories/song-chunk.repository';
import { CreateSongChunkDto } from './dto/create-song-chunk.dto';

@Injectable()
export class SongChunkService {
  public constructor(
    private readonly songChunkRepository: ISongChunkRepository,
  ) {}

  public createMany(songChunks: CreateSongChunkDto[]): Promise<void> {
    return this.songChunkRepository.createMany(songChunks);
  }

  public findAllBySong(song: number): Promise<SongChunk[]> {
    return this.songChunkRepository.findAllBySong(song);
  }
}
