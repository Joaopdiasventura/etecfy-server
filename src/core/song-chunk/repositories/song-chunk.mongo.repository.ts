import { CreateSongChunkDto } from '../dto/create-song-chunk.dto';
import { SongChunk } from '../entities/song-chunk.entity';
import { ISongChunkRepository } from './song-chunk.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

export class MongoSongChunkRepository implements ISongChunkRepository {
  public constructor(
    @InjectModel('song-chunk')
    private readonly songChunkModel: Model<SongChunk>,
  ) {}

  public async createMany(songChunks: CreateSongChunkDto[]): Promise<void> {
    await this.songChunkModel.insertMany(songChunks, { ordered: true });
  }

  public findAllBySong(song: string): Promise<SongChunk[]> {
    return this.songChunkModel
      .find({ song })
      .select('url duration')
      .sort({ _id: 1 })
      .exec();
  }
}
