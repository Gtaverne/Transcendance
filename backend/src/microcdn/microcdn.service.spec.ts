import { Test, TestingModule } from '@nestjs/testing';
import { MicrocdnService } from './microcdn.service';

describe('MicrocdnService', () => {
  let service: MicrocdnService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MicrocdnService],
    }).compile();

    service = module.get<MicrocdnService>(MicrocdnService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
