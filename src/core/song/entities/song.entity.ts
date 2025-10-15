import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ versionKey: false, timestamps: true })
export class Song extends Document<string, Song, Song> {
  @Prop({ required: true })
  public title: string;

  @Prop({ required: true })
  public description: string;

  @Prop({ required: true })
  public artist: string;

  @Prop({ required: true })
  public lyrics: string;

  @Prop({ required: true })
  public thumbnail: string;

  @Prop({ required: true, type: String, ref: 'User' })
  public user: string;

  @Prop({ required: true })
  public duration: number;
}

export const SongSchema = SchemaFactory.createForClass(Song);
