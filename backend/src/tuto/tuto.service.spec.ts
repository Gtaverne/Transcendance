import { Test, TestingModule } from '@nestjs/testing';
import { TutoService } from './tuto.service';

describe('TutoService', () => {
  let service: TutoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TutoService],
    }).compile();

    service = module.get<TutoService>(TutoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
