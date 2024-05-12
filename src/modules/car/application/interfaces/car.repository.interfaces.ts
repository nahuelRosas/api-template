import {
  IDeleteCarResponse,
  IUpdateCarResponse,
} from '@car/application/interfaces/car.common.interfaces';
import { Car } from '@car/domain/car.domain';

import { GetAllPaginationDto } from '@/common/application/dto/get-all-pagination.dto';
import { IdentifierDto } from '@/common/application/dto/identifier.dto';
import {
  IFindAllResponse,
  IPromiseResponse,
} from '@/common/application/interfaces/common.interfaces';

export const CAR_REPOSITORY = 'CAR_REPOSITORY';

export type TRepositoryCar = {
  car: Car;
};

export type TRepositoryUpdateCar = {
  car: Car;
  oldCar?: Car;
};

/**
 * Represents the interface for a car repository.
 */
export interface ICarRepository {
  /**
   * Creates a new car.
   * @param car - The car data.
   * @returns A promise that resolves to the created car.
   */
  create({ car }: TRepositoryCar): IPromiseResponse<Car>;

  /**
   * Updates an existing car.
   * @param car - The updated car data.
   * @param oldCar - The original car data.
   * @param id - The identifier of the car to update.
   * @returns A promise that resolves to the updated car response.
   */
  update(
    { car, oldCar }: TRepositoryUpdateCar,
    { id }: IdentifierDto,
  ): IPromiseResponse<IUpdateCarResponse>;

  /**
   * Updates an existing car internally.
   * @param car - The updated car data.
   * @param id - The identifier of the car to update.
   * @returns A promise that resolves to the updated car.
   */
  internalUpdate(
    { car }: TRepositoryCar,
    { id }: IdentifierDto,
  ): IPromiseResponse<Car>;

  /**
   * Deletes a car.
   * @param id - The identifier of the car to delete.
   * @returns A promise that resolves to the delete car response.
   */
  delete({ id }: IdentifierDto): IPromiseResponse<IDeleteCarResponse>;

  /**
   * Retrieves all cars with pagination.
   * @param skip - The number of cars to skip.
   * @param take - The number of cars to take.
   * @returns A promise that resolves to the find all cars response.
   */
  findAll({
    skip,
    take,
  }: GetAllPaginationDto): IPromiseResponse<IFindAllResponse<Car>>;

  /**
   * Retrieves a car by its identifier.
   * @param id - The identifier of the car to find.
   * @returns A promise that resolves to the found car or null if not found.
   */
  findById({ id }: IdentifierDto): IPromiseResponse<Car | null>;
}
