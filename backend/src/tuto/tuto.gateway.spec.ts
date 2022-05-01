import { Test, TestingModule } from '@nestjs/testing';
import { TutoGateway } from './tuto.gateway';
import { TutoService } from './tuto.service';

describe('TutoGateway', () => {
  let gateway: TutoGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TutoGateway, TutoService],
    }).compile();

    gateway = module.get<TutoGateway>(TutoGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
