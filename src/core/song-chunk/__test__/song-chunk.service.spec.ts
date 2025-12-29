import { Test, TestingModule } from '@nestjs/testing';
import { SongChunkService } from './song-chunk.service';

describe('SongChunkService', () => {
  let service: SongChunkService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SongChunkService],
    }).compile();

    service = module.get<SongChunkService>(SongChunkService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
