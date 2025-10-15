import { Module } from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import { PlaylistController } from './playlist.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PlaylistSchema } from './entities/playlist.entity';
import { UserModule } from '../user/user.module';
import { SongModule } from '../song/song.module';
import { MongoPlaylistRepository } from './repositories/playlist.mongo.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Playlist', schema: PlaylistSchema }]),
    UserModule,
    SongModule,
  ],
  controllers: [PlaylistController],
  providers: [
    PlaylistService,
    { provide: 'IPlaylistRepository', useClass: MongoPlaylistRepository },
  ],
})
export class PlaylistModule {}
