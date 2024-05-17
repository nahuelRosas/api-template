import {
  IDeleteCarResponse,
  IUpdateCarResponse,
} from '@car/application/interfaces/car.common.interfaces';
import {
  CAR_MAPPER,
  ICarMapper,
} from '@car/application/interfaces/car.mapper.interfaces';
import {
  CAR_REPOSITORY,
  ICarRepository,
} from '@car/application/interfaces/car.repository.interfaces';
import {
  ICarService,
  TCarPicturesUpdateOrCreate,
  TServiceCreateCar,
  TServiceUpdateCar,
} from '@car/application/interfaces/car.service.interfaces';
import { Car } from '@car/domain/car.domain';
import { Inject, Injectable } from '@nestjs/common';
import {
  IPictureService,
  PICTURE_SERVICE,
} from '@picture/application/interfaces/picture.service.interfaces';

import { GetAllPaginationDto } from '@/common/application/dto/get-all-pagination.dto';
import { IdentifierDto } from '@/common/application/dto/identifier.dto';
import {
  IFindAllResponse,
  IPromiseResponse,
} from '@/common/application/interfaces/common.interfaces';

@Injectable()
export class CarService implements ICarService {
  constructor(
    @Inject(CAR_REPOSITORY)
    private readonly carRepository: ICarRepository,
    @Inject(CAR_MAPPER)
    private readonly carMapper: ICarMapper,
    @Inject(PICTURE_SERVICE)
    private readonly pictureService: IPictureService,
  ) {}

  /**
   * Validates and creates pictures for a car.
   * @param carEntity - The car entity.
   * @param pictures - The pictures to create.
   * @param files - The files associated with the pictures.
   * @returns A promise that resolves to the created car with pictures.
   */
  async validateAndCreatePictures({
    carEntity,
    pictures,
    files,
  }: TCarPicturesUpdateOrCreate): IPromiseResponse<Car> {
    this.pictureService.validateDocumentationPicture({
      files,
      FileDocumentationDto: pictures,
    });
    const response = await this.carRepository.create({ car: carEntity });
    const createdPictures = await this.pictureService.create(
      {
        documentation: pictures,
        files,
      },
      {
        id: response.payload.id,
      },
    );
    carEntity.pictures = createdPictures;
    return await this.carRepository.internalUpdate(
      {
        car: carEntity,
      },
      {
        id: response.payload.id,
      },
    );
  }

  /**
   * Validates and updates pictures for a car.
   * @param carEntity - The car entity.
   * @param pictures - The pictures to update.
   * @param files - The files associated with the pictures.
   * @param id - The ID of the car.
   * @returns A promise that resolves to the updated car with pictures.
   */
  async validateAndUpdatePictures(
    { carEntity, pictures, files }: TCarPicturesUpdateOrCreate,
    { id }: IdentifierDto,
  ): IPromiseResponse<IUpdateCarResponse> {
    this.pictureService.validateDocumentationPicture({
      files,
      FileDocumentationDto: pictures,
    });
    const { payload: oldCar } = await this.findById({ id });
    const createdPictures = await this.pictureService.update(
      {
        oldPictures: oldCar.pictures,
        newPictures: {
          documentation: pictures,
          files,
        },
      },
      { id },
    );
    carEntity.pictures = createdPictures;
    return await this.carRepository.update(
      {
        car: carEntity,
        oldCar,
      },
      {
        id,
      },
    );
  }

  /**
   * Creates a new car.
   * @param car - The car data.
   * @param files - The files associated with the car.
   * @returns A promise that resolves to the created car.
   */
  async create({ car, files }: TServiceCreateCar): IPromiseResponse<Car> {
    try {
      const { pictures, ...carData } = car;
      const carEntity = this.carMapper.fromDtoToEntity({
        carDto: carData,
      });

      if ((files && Object.entries(files).length) || pictures) {
        return await this.validateAndCreatePictures({
          carEntity,
          pictures,
          files,
        });
      }
      return await this.carRepository.create({ car: carEntity });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Updates an existing car.
   * @param car - The updated car data.
   * @param id - The ID of the car to update.
   * @returns A promise that resolves to the updated car.
   */
  async update(
    { files, car }: TServiceUpdateCar,
    { id }: IdentifierDto,
  ): IPromiseResponse<IUpdateCarResponse> {
    try {
      const { pictures, ...carData } = car;
      const carEntity = this.carMapper.fromDtoToEntity({
        carDto: carData,
      });
      if (files || pictures) {
        return await this.validateAndUpdatePictures(
          {
            carEntity,
            pictures,
            files,
          },
          { id },
        );
      }
      return await this.carRepository.update(
        {
          car: carEntity,
        },
        { id },
      );
    } catch (error) {
      throw error;
    }
  }

  /**
   * Deletes a car.
   * @param id - The ID of the car to delete.
   * @returns A promise that resolves to the deleted car.
   */
  async delete({ id }: IdentifierDto): IPromiseResponse<IDeleteCarResponse> {
    try {
      const { payload: oldCar } = await this.carRepository.findById({ id });
      await this.pictureService.delete({ pictures: oldCar.pictures });
      const response = await this.carRepository.delete({
        id,
      });
      return {
        ...response,
        payload: {
          deletedCar: oldCar,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Retrieves all cars.
   * @param take - The maximum number of cars to retrieve.
   * @param skip - The number of cars to skip.
   * @returns A promise that resolves to the list of cars.
   */
  async findAll({
    take,
    skip,
  }: GetAllPaginationDto): IPromiseResponse<IFindAllResponse<Car>> {
    try {
      return await this.carRepository.findAll({
        skip,
        take,
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Retrieves a car by ID.
   * @param id - The ID of the car to retrieve.
   * @returns A promise that resolves to the car.
   */
  async findById({ id }: IdentifierDto): IPromiseResponse<Car> {
    try {
      return await this.carRepository.findById({ id });
    } catch (error) {
      throw error;
    }
  }
}
