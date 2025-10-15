import { Controller, Get, Param } from '@nestjs/common';
import { SongChunkService } from './song-chunk.service';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { SongChunk } from './entities/song-chunk.entity';

@Controller('song-chunk')
export class SongChunkController {
  public constructor(private readonly songChunkService: SongChunkService) {}

  @Get(':song')
  public findAllBySong(
    @Param('song', ParseObjectIdPipe) song: string,
  ): Promise<SongChunk[]> {
    return this.songChunkService.findAllBySong(song);
  }
}
