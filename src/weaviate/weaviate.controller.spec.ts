import { Test, TestingModule } from '@nestjs/testing';
import { WeaviateController } from './weaviate.controller';

describe('WeaviateController', () => {
  let controller: WeaviateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WeaviateController],
    }).compile();

    controller = module.get<WeaviateController>(WeaviateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
