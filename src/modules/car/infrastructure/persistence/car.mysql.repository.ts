import {
  IDeleteCarResponse,
  IUpdateCarResponse,
} from '@car/application/interfaces/car.common.interfaces';
import {
  ICarRepository,
  TRepositoryCar,
  TRepositoryUpdateCar,
} from '@car/application/interfaces/car.repository.interfaces';
import { RepositoryMessage } from '@car/application/messages/messages.car';
import { Car } from '@car/domain/car.domain';
import { CarSchema } from '@car/infrastructure/persistence/car.schema';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { GetAllPaginationDto } from '@/common/application/dto/get-all-pagination.dto';
import { IdentifierDto } from '@/common/application/dto/identifier.dto';
import {
  IFindAllResponse,
  IPromiseResponse,
} from '@/common/application/interfaces/common.interfaces';
import {
  EResponseType,
  IResponseService,
  RESPONSE_SERVICE,
} from '@/common/application/interfaces/response.interface';

@Injectable()
export class CarMysqlRepository implements ICarRepository {
  constructor(
    @InjectRepository(CarSchema)
    private readonly carRepository: Repository<Car>,
    @Inject(RESPONSE_SERVICE)
    private readonly responseService: IResponseService,
  ) {
    this.responseService.setContext(CarMysqlRepository.name);
  }

  /**
   * Creates a new car in the database.
   * @param car - The car object to be created.
   * @returns A promise that resolves to the created car.
   * @throws InternalServerErrorException if there is an error while creating the car.
   */
  async create({ car }: TRepositoryCar): IPromiseResponse<Car> {
    try {
      const createdCar = await this.carRepository.save(car);
      if (!car.pictures)
        return this.responseService.createResponse({
          statusCode: 201,
          message: `${RepositoryMessage.CREATE_SUCCESS}: ${RepositoryMessage.WITH_ID} ${createdCar.id}`,
          payload: createdCar,
        });
    } catch (error) {
      this.responseService.errorResponse({
        type: EResponseType.INTERNAL_SERVER_ERROR,
        message: RepositoryMessage.CREATE_ERROR,
        error,
      });
    }
  }

  /**
   * Updates an existing car in the database.
   * @param car - The updated car object.
   * @param oldCar - The old car object.
   * @param id - The ID of the car to be updated.
   * @returns A promise that resolves to the updated car.
   * @throws NotFoundException if the car with the given ID is not found.
   * @throws InternalServerErrorException if there is an error while updating the car.
   */
  async update(
    { car, oldCar }: TRepositoryUpdateCar,
    { id }: IdentifierDto,
  ): IPromiseResponse<IUpdateCarResponse> {
    try {
      const { payload: oldCarLocal } = await this.findById({ id });

      if (!oldCarLocal) {
        this.responseService.errorResponse({
          type: EResponseType.NOT_FOUND,
          message: `${RepositoryMessage.NOT_FOUND} ${RepositoryMessage.WITH_ID} ${id}`,
        });
      }

      await this.carRepository.save({ id, ...car });

      const { payload: updatedCar } = await this.findById({ id });

      return this.responseService.createResponse({
        statusCode: 200,
        message: `${RepositoryMessage.UPDATE_SUCCESS} ${RepositoryMessage.WITH_ID} ${id}`,
        payload: { oldCar: oldCar || oldCarLocal, newCar: updatedCar },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        this.responseService.errorResponse({
          type: EResponseType.INTERNAL_SERVER_ERROR,
          message: RepositoryMessage.UPDATE_ERROR,
          error,
        });
      }
    }
  }

  /**
   * Updates an existing car in the database without returning the updated car.
   * @param car - The updated car object.
   * @param id - The ID of the car to be updated.
   * @returns A promise that resolves to a success message.
   * @throws InternalServerErrorException if there is an error while updating the car.
   */
  async internalUpdate(
    { car }: TRepositoryCar,
    { id }: IdentifierDto,
  ): IPromiseResponse<Car> {
    try {
      await this.carRepository.save({ id, ...car });

      const payload = await this.carRepository.findOne({
        where: { id },
        relations: ['pictures'],
      });

      return this.responseService.createResponse({
        statusCode: 201,
        message: RepositoryMessage.CREATE_SUCCESS,
        payload,
      });
    } catch (error) {
      this.responseService.errorResponse({
        type: EResponseType.INTERNAL_SERVER_ERROR,
        error: RepositoryMessage.CREATE_ERROR,
        message: error.message,
      });
    }
  }

  /**
   * Deletes a car from the database.
   * @param id - The ID of the car to be deleted.
   * @returns A promise that resolves to a success message.
   * @throws NotFoundException if the car with the given ID is not found.
   * @throws InternalServerErrorException if there is an error while deleting the car.
   */
  async delete({ id }: IdentifierDto): IPromiseResponse<IDeleteCarResponse> {
    try {
      const { payload } = await this.findById({ id });

      if (!payload) {
        this.responseService.errorResponse({
          type: EResponseType.NOT_FOUND,
          message: `${RepositoryMessage.NOT_FOUND} ${RepositoryMessage.WITH_ID} ${id}`,
        });
      }
      const { affected } = await this.carRepository.delete({ id });

      if (affected === 0) {
        this.responseService.errorResponse({
          type: EResponseType.INTERNAL_SERVER_ERROR,
          message: `${RepositoryMessage.DELETE_ERROR} ${RepositoryMessage.WITH_ID} ${id}`,
        });
      }

      return this.responseService.createResponse({
        statusCode: 200,
        message: `${RepositoryMessage.DELETE_SUCCESS} ${RepositoryMessage.WITH_ID} ${id}`,
        payload: { deletedCar: payload },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        this.responseService.errorResponse({
          type: EResponseType.INTERNAL_SERVER_ERROR,
          message: RepositoryMessage.DELETE_ERROR,
          error,
        });
      }
    }
  }

  /**
   * Retrieves all cars from the database.
   * @param skip - The number of cars to skip.
   * @param take - The number of cars to take.
   * @returns A promise that resolves to an array of cars and the total count.
   * @throws InternalServerErrorException if there is an error while retrieving the cars.
   */
  async findAll({
    skip = 0,
    take = 20,
  }: GetAllPaginationDto): IPromiseResponse<IFindAllResponse<Car>> {
    try {
      const [cars, total] = await this.carRepository.findAndCount({
        skip,
        take,
        relations: ['pictures'],
      });

      return this.responseService.createResponse({
        statusCode: 200,
        message: `${RepositoryMessage.FIND_SUCCESS} (${cars.length} found)`,
        payload: { items: cars, total, take, skip },
      });
    } catch (error) {
      this.responseService.errorResponse({
        type: EResponseType.INTERNAL_SERVER_ERROR,
        message: RepositoryMessage.FIND_ERROR,
        error: error.message,
      });
    }
  }

  /**
   * Retrieves a car by its ID from the database.
   * @param id - The ID of the car to retrieve.
   * @returns A promise that resolves to the retrieved car.
   * @throws NotFoundException if the car with the given ID is not found.
   * @throws InternalServerErrorException if there is an error while retrieving the car.
   */
  async findById({ id }: IdentifierDto): IPromiseResponse<Car | null> {
    try {
      const car = await this.carRepository.findOne({
        where: { id },
        relations: ['pictures'],
      });

      if (!car) {
        this.responseService.errorResponse({
          type: EResponseType.NOT_FOUND,
          message: `${RepositoryMessage.NOT_FOUND} ${RepositoryMessage.WITH_ID} ${id}`,
        });
      }
      return this.responseService.createResponse({
        statusCode: 200,
        message: `${RepositoryMessage.FIND_SUCCESS} ${RepositoryMessage.WITH_ID} ${id}`,
        payload: car,
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        this.responseService.errorResponse({
          type: EResponseType.INTERNAL_SERVER_ERROR,
          message: RepositoryMessage.FIND_ERROR,
          error: error.message,
        });
      }
    }
  }
}
