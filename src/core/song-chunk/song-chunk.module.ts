import { Module } from '@nestjs/common';
import { SongChunkService } from './song-chunk.service';
import { SongChunkController } from './song-chunk.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SongChunk } from './entities/song-chunk.entity';
import { ISongChunkRepository } from './repositories/song-chunk.repository';
import { SongChunkPostgresRepository } from './repositories/song-chunk.postgres.repository';

@Module({
  imports: [TypeOrmModule.forFeature([SongChunk])],
  controllers: [SongChunkController],
  providers: [
    SongChunkService,
    { provide: ISongChunkRepository, useClass: SongChunkPostgresRepository },
  ],
  exports: [SongChunkService],
})
export class SongChunkModule {}
