import { CreateCarDto } from '@car/application/dto/request/create-car.dto';
import { UpdateCarDto } from '@car/application/dto/request/update-car.dto';
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
import { FileUploadCarDto } from '@/modules/picture/application/dto/files-upload-car.dto';

/**
 * Represents the interface for a Car Controller.
 */
export interface ICarController {
  /**
   * Creates a new car.
   * @param files - The files to upload for the car.
   * @param car - The car data to create.
   * @returns A promise that resolves to the created car.
   */
  create(files: FileUploadCarDto, car: CreateCarDto): IPromiseResponse<Car>;

  /**
   * Updates an existing car.
   * @param files - The files to upload for the car.
   * @param car - The car data to update.
   * @param id - The identifier of the car to update.
   * @returns A promise that resolves to the updated car response.
   */
  update(
    files: FileUploadCarDto,
    car: UpdateCarDto,
    { id }: IdentifierDto,
  ): IPromiseResponse<IUpdateCarResponse>;

  /**
   * Deletes a car by its identifier.
   * @param id - The identifier of the car to delete.
   * @returns A promise that resolves to the delete car response.
   */
  delete({ id }: IdentifierDto): IPromiseResponse<IDeleteCarResponse>;

  /**
   * Finds all cars based on the provided query parameters.
   * @param query - The query parameters for pagination and filtering.
   * @returns A promise that resolves to the response containing the found cars.
   */
  findAll(query: GetAllPaginationDto): IPromiseResponse<IFindAllResponse<Car>>;

  /**
   * Finds a car by its identifier.
   * @param id - The identifier of the car to find.
   * @returns A promise that resolves to the found car.
   */
  findById({ id }: IdentifierDto): IPromiseResponse<Car>;
}
