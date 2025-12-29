import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { SongChunkService } from './song-chunk.service';
import { SongChunk } from './entities/song-chunk.entity';

@Controller('song-chunk')
export class SongChunkController {
  public constructor(private readonly songChunkService: SongChunkService) {}

  @Get(':song')
  public findAllBySong(
    @Param('song', ParseIntPipe) song: number,
  ): Promise<SongChunk[]> {
    return this.songChunkService.findAllBySong(song);
  }
}
