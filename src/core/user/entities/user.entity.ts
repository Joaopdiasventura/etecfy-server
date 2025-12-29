import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Index({ unique: true })
  @Column({ nullable: false, type: 'varchar', length: 255 })
  public email: string;

  @Column({ nullable: false, length: 100 })
  public name: string;

  @Column({ nullable: false, type: 'char', length: 60 })
  public password?: string;

  @CreateDateColumn({
    type: 'timestamptz',
    name: 'created_at',
  })
  public createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    name: 'updated_at',
  })
  public updatedAt: Date;
}
