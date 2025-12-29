import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('songs')
export class Song {
  @PrimaryGeneratedColumn('increment')
  public id: number;

  @Column({ nullable: false, type: 'text' })
  public title: string;

  @Column({ nullable: false, type: 'text' })
  public description: string;

  @Column({ nullable: false, type: 'text' })
  public artist: string;

  @Column({ nullable: false, type: 'text' })
  public lyrics: string;

  @Column({ nullable: false, type: 'text' })
  public duration: number;

  @Column({ nullable: false, type: 'text' })
  public thumbnail: string;
}
