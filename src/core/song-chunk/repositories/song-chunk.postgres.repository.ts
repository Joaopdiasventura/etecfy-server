import { InjectRepository } from '@nestjs/typeorm';
import { CreateSongChunkDto } from '../dto/create-song-chunk.dto';
import { SongChunk } from '../entities/song-chunk.entity';
import { ISongChunkRepository } from './song-chunk.repository';
import { Repository } from 'typeorm';

export class SongChunkPostgresRepository implements ISongChunkRepository {
  public constructor(
    @InjectRepository(SongChunk)
    private readonly repository: Repository<SongChunk>,
  ) {}

  public async createMany(songChunks: CreateSongChunkDto[]): Promise<void> {
    await this.repository.insert(songChunks);
  }

  public findAllBySong(song: number): Promise<SongChunk[]> {
    return this.repository.find({
      where: { song: { id: song } },
      select: { url: true, duration: true },
      order: { createdAt: 'ASC' },
    });
  }
}
