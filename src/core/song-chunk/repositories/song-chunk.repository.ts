import { CreateSongChunkDto } from '../dto/create-song-chunk.dto';
import { SongChunk } from '../entities/song-chunk.entity';

export interface ISongChunkRepository {
  createMany(musicChunks: CreateSongChunkDto[]): Promise<void>;
  findAllBySong(song: string): Promise<SongChunk[]>;
}
