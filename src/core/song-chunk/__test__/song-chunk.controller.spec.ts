import { Test, TestingModule } from '@nestjs/testing';
import { SongChunkController } from './song-chunk.controller';
import { SongChunkService } from './song-chunk.service';

describe('SongChunkController', () => {
  let controller: SongChunkController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SongChunkController],
      providers: [SongChunkService],
    }).compile();

    controller = module.get<SongChunkController>(SongChunkController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
