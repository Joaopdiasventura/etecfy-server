import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Song } from '../../song/entities/song.entity';

@Entity('song-chunks')
export class SongChunk {
  @PrimaryGeneratedColumn('increment')
  public id: number;

  @Column({ nullable: false, type: 'text' })
  public url: string;

  @Column({ nullable: false, type: 'float' })
  public duration: number;

  @CreateDateColumn({ type: 'time without time zone', name: 'created_at' })
  public createdAt: Date;

  @Index()
  @ManyToOne(() => Song, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'fk_song_id' })
  public song: Song;
}
