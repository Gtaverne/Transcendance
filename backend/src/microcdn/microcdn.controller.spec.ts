import { Test, TestingModule } from '@nestjs/testing';
import { MicrocdnController } from './microcdn.controller';

describe('MicrocdnController', () => {
  let controller: MicrocdnController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MicrocdnController],
    }).compile();

    controller = module.get<MicrocdnController>(MicrocdnController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
