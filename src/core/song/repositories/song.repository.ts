import { CreateSongDto } from '../dto/create-song.dto';
import { FindSongDto } from '../dto/find-song.dto';
import { Song } from '../entities/song.entity';

export interface ISongRepository {
  create(createSongDto: CreateSongDto): Promise<Song>;
  findById(id: string): Promise<Song | null>;
  findMany(findSongDto: FindSongDto): Promise<Song[]>;
}
