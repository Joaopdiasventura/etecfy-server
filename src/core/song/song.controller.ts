import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { SongService } from './song.service';
import { CreateSongDto } from './dto/create-song.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { FindSongDto } from './dto/find-song.dto';
import { Song } from './entities/song.entity';
import { MessageResponse } from '../../shared/interfaces/responses/message';

@Controller('song')
export class SongController {
  public constructor(private readonly songService: SongService) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'song', maxCount: 1 },
      { name: 'thumbnail', maxCount: 1 },
    ]),
  )
  public create(
    @Body() createSongDto: CreateSongDto,
    @UploadedFiles()
    files: {
      song: Express.Multer.File[];
      thumbnail: Express.Multer.File[];
    },
  ): Promise<MessageResponse> {
    return this.songService.create(
      createSongDto,
      files.song[0],
      files.thumbnail[0],
    );
  }

  @Get()
  public findMany(@Query() findSongDto: FindSongDto): Promise<Song[]> {
    return this.songService.findMany(findSongDto);
  }

  @Get(':id')
  public findById(@Param('id') id: number): Promise<Song> {
    return this.songService.findById(id);
  }
}
