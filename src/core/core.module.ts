import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { SongModule } from './song/song.module';
import { SongChunkModule } from './song-chunk/song-chunk.module';
import { PlaylistModule } from './playlist/playlist.module';

@Module({
  imports: [UserModule, SongModule, SongChunkModule, PlaylistModule],
})
export class CoreModule {}
