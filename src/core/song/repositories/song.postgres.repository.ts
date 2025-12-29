import { InjectRepository } from '@nestjs/typeorm';
import { CreateSongDto } from '../dto/create-song.dto';
import { FindSongDto } from '../dto/find-song.dto';
import { Song } from '../entities/song.entity';
import { ISongRepository } from './song.repository';
import { Repository } from 'typeorm';

export class SongPostgresRepository implements ISongRepository {
  private readonly allowedFields: Record<string, string> = {
    title: 'song.title',
    artist: 'song.artist',
    duration: 'song.duration',
  };

  public constructor(
    @InjectRepository(Song) private readonly repository: Repository<Song>,
  ) {}

  public create(createSongDto: CreateSongDto): Promise<Song> {
    return this.repository.save(createSongDto);
  }

  public findById(id: number): Promise<Song | null> {
    return this.repository.findOne({ where: { id } });
  }

  public findMany(findSongDto: FindSongDto): Promise<Song[]> {
    const query = this.repository
      .createQueryBuilder('song')
      .select([
        'song.id',
        'song.title',
        'song.artist',
        'song.duration',
        'song.thumbnail',
      ]);

    if (findSongDto.title)
      query.andWhere('song.title ILIKE :title', {
        title: `%${findSongDto.title}%`,
      });

    if (findSongDto.artist)
      query.andWhere('song.artist = :artist', {
        artist: findSongDto.artist,
      });

    if (findSongDto.orderBy) {
      const [field, dir] = findSongDto.orderBy.split(':');

      const column = this.allowedFields[field];

      if (column) query.orderBy(column, dir == 'desc' ? 'DESC' : 'ASC');
    }

    if (findSongDto.limit)
      query
        .skip(((findSongDto.page ?? 10) - 1) * findSongDto.limit)
        .take(findSongDto.limit);

    return query.getMany();
  }
}
