import { Module } from '@nestjs/common';
import { SongService } from './song.service';
import { SongController } from './song.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SongSchema } from './entities/song.entity';
import { FileModule } from '../../shared/modules/file/file.module';
import { MongoSongRepository } from './repositories/song.mongo.repository';
import { SongChunkModule } from '../song-chunk/song-chunk.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Song', schema: SongSchema }]),
    UserModule,
    SongChunkModule,
    FileModule,
  ],
  controllers: [SongController],
  providers: [
    SongService,
    { provide: 'ISongRepository', useClass: MongoSongRepository },
  ],
  exports: [SongService],
})
export class SongModule {}
