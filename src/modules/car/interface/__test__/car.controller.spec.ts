import { Test, TestingModule } from '@nestjs/testing';

import { AppModule } from '@/app.module';
import { PICTURE_REPOSITORY } from '@/modules/picture/application/interfaces/picture.repository.interfaces';

import { CAR_REPOSITORY } from '../../application/interfaces/car.repository.interfaces';
import { CarController } from '../car.controller';

const mockedCarRepository = {
  create: jest.fn(),
  delete: jest.fn(),
  findAll: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
};

const mockedPictureRepository = {
  create: jest.fn(),
  delete: jest.fn(),
  findAll: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
};

describe('BookController', () => {
  let controller: CarController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(CAR_REPOSITORY)
      .useValue(mockedCarRepository)
      .overrideProvider(PICTURE_REPOSITORY)
      .useValue(mockedPictureRepository)
      .compile();

    controller = module.get<CarController>(CarController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
