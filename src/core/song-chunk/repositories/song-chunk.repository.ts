import { CreateSongChunkDto } from '../dto/create-song-chunk.dto';
import { SongChunk } from '../entities/song-chunk.entity';

export abstract class ISongChunkRepository {
  public abstract createMany(songChunks: CreateSongChunkDto[]): Promise<void>;
  public abstract findAllBySong(song: number): Promise<SongChunk[]>;
}
