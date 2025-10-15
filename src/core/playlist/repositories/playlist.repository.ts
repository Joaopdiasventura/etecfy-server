import { CreatePlaylistDto } from '../dto/create-playlist.dto';
import { FindPlaylistDto } from '../dto/find-playlist.dto';
import { UpdatePlaylistDto } from '../dto/update-playlist.dto';
import { Playlist } from '../entities/playlist.entity';

export interface IPlaylistRepsitory {
  create(createPlaylistDto: CreatePlaylistDto): Promise<Playlist>;
  findById(id: string): Promise<Playlist | null>;
  findMany(findPlaylistDto: FindPlaylistDto): Promise<Playlist[]>;
  update(id: string, updatePlaylistDto: UpdatePlaylistDto): Promise<void>;
  delete(id: string): Promise<void>;
}
