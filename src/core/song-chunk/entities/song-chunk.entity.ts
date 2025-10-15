import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ versionKey: false, timestamps: true })
export class SongChunk extends Document<string, SongChunk, SongChunk> {
  @Prop({ required: true })
  public url: string;

  @Prop({ required: true })
  public duration: number;

  @Prop({ required: true, index: true, type: String, ref: 'Song' })
  public song: string;
}

export const SongChunkSchema = SchemaFactory.createForClass(SongChunk);
