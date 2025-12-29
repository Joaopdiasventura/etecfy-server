import { CreateSongDto } from '../dto/create-song.dto';
import { FindSongDto } from '../dto/find-song.dto';
import { Song } from '../entities/song.entity';

export abstract class ISongRepository {
  public abstract create(createSongDto: CreateSongDto): Promise<Song>;
  public abstract findById(id: number): Promise<Song | null>;
  public abstract findMany(findSongDto: FindSongDto): Promise<Song[]>;
}
