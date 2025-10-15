import { Module } from '@nestjs/common';
import { SongChunkService } from './song-chunk.service';
import { SongChunkController } from './song-chunk.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SongChunkSchema } from './entities/song-chunk.entity';
import { MongoSongChunkRepository } from './repositories/song-chunk.mongo.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'song-chunk', schema: SongChunkSchema },
    ]),
  ],
  controllers: [SongChunkController],
  providers: [
    SongChunkService,
    { provide: 'ISongChunkRepository', useClass: MongoSongChunkRepository },
  ],
  exports: [SongChunkService],
})
export class SongChunkModule {}
