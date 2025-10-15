import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { FindPlaylistDto } from './dto/find-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { Playlist } from './entities/playlist.entity';
import { Message } from '../../shared/interfaces/messages';

@Controller('playlist')
export class PlaylistController {
  public constructor(private readonly playlistService: PlaylistService) {}

  @Post()
  public create(
    @Body() createPlaylistDto: CreatePlaylistDto,
  ): Promise<Message> {
    return this.playlistService.create(createPlaylistDto);
  }

  @Get(':id')
  public findById(@Param('id') id: string): Promise<Playlist> {
    return this.playlistService.findById(id);
  }

  @Get()
  public findMany(
    @Query() findPlaylistDto: FindPlaylistDto,
  ): Promise<Playlist[]> {
    return this.playlistService.findMany(findPlaylistDto);
  }

  @Patch(':id')
  public update(
    @Param('id') id: string,
    @Body() updatePlaylistDto: UpdatePlaylistDto,
  ): Promise<Message> {
    return this.playlistService.update(id, updatePlaylistDto);
  }

  @Delete(':id')
  public delete(@Param('id') id: string): Promise<Message> {
    return this.playlistService.delete(id);
  }
}
