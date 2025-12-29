import { Module } from '@nestjs/common';
import { SongService } from './song.service';
import { SongController } from './song.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Song } from './entities/song.entity';
import { ISongRepository } from './repositories/song.repository';
import { SongPostgresRepository } from './repositories/song.postgres.repository';
import { SongChunkModule } from '../song-chunk/song-chunk.module';
import { FileModule } from '../../shared/modules/file/file.module';

@Module({
  imports: [TypeOrmModule.forFeature([Song]), SongChunkModule, FileModule],
  controllers: [SongController],
  providers: [
    SongService,
    { provide: ISongRepository, useClass: SongPostgresRepository },
  ],
})
export class SongModule {}
