import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { FindPlaylistDto } from './dto/find-playlist.dto';
import { UserService } from '../user/user.service';
import { SongService } from '../song/song.service';
import { Playlist } from './entities/playlist.entity';
import { Message } from '../../shared/interfaces/messages';
import type { IPlaylistRepsitory } from './repositories/playlist.repository';

@Injectable()
export class PlaylistService {
  public constructor(
    @Inject('IPlaylistRepository')
    private readonly playlistRepository: IPlaylistRepsitory,
    private readonly userService: UserService,
    private readonly songService: SongService,
  ) {}

  public async create(createPlaylistDto: CreatePlaylistDto): Promise<Message> {
    await this.userService.findById(createPlaylistDto.user);
    if (!createPlaylistDto.songs.length)
      throw new BadRequestException('Selecione ao menos uma musica');
    for (const song of createPlaylistDto.songs)
      await this.songService.findById(song);
    createPlaylistDto.firstSong = createPlaylistDto.songs[0];
    const { id } = await this.playlistRepository.create(createPlaylistDto);
    return { message: id };
  }

  public async findById(id: string): Promise<Playlist> {
    const playlist = await this.playlistRepository.findById(id);
    if (!playlist) throw new NotFoundException('Playlist não encontrada');
    return playlist;
  }

  public findMany(findPlaylistDto: FindPlaylistDto): Promise<Playlist[]> {
    return this.playlistRepository.findMany(findPlaylistDto);
  }

  public async update(
    id: string,
    updatePlaylistDto: UpdatePlaylistDto,
  ): Promise<Message> {
    await this.findById(id);

    if (updatePlaylistDto.user)
      await this.userService.findById(updatePlaylistDto.user);

    if (updatePlaylistDto.songs)
      for (const song of updatePlaylistDto.songs)
        await this.songService.findById(song);

    return { message: 'Playlist atualizada com sucesso' };
  }

  public async delete(id: string): Promise<Message> {
    await this.findById(id);
    await this.playlistRepository.delete(id);
    return { message: 'Playlist deletada com sucesso' };
  }
}
