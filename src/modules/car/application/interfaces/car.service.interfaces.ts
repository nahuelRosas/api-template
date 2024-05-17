import { CreateCarDto } from '@car/application/dto/request/create-car.dto';
import { UpdateCarDto } from '@car/application/dto/request/update-car.dto';
import {
  IDeleteCarResponse,
  IUpdateCarResponse,
} from '@car/application/interfaces/car.common.interfaces';
import { Car } from '@car/domain/car.domain';
import { FileUploadCarDto } from '@picture/application/dto/files-upload-car.dto';
import { FileDocumentationDto } from '@picture/application/dto/request/files-documentation.dto';

import { GetAllPaginationDto } from '@/common/application/dto/get-all-pagination.dto';
import { IdentifierDto } from '@/common/application/dto/identifier.dto';
import {
  IFindAllResponse,
  IPromiseResponse,
} from '@/common/application/interfaces/common.interfaces';

export const CAR_SERVICE = 'CAR_SERVICE';

export type TCarPicturesUpdateOrCreate = {
  carEntity: Car;
  pictures: FileDocumentationDto;
  files: FileUploadCarDto;
};

export type TServiceCreateCar = {
  car: CreateCarDto;
  files?: FileUploadCarDto;
};

export type TServiceUpdateCar = {
  car: UpdateCarDto;
  files?: FileUploadCarDto;
};

/**
 * Represents the interface for a car service.
 */
export interface ICarService {
  /**
   * Validates and creates pictures for a car entity.
   * @param carEntity - The car entity.
   * @param pictures - The pictures to be validated and created.
   * @param files - The files associated with the pictures.
   * @returns A promise that resolves to the created car entity.
   */
  validateAndCreatePictures({
    carEntity,
    pictures,
    files,
  }: TCarPicturesUpdateOrCreate): IPromiseResponse<Car>;

  /**
   * Validates and updates pictures for a car entity.
   * @param carEntity - The car entity.
   * @param pictures - The pictures to be validated and updated.
   * @param files - The files associated with the pictures.
   * @param id - The identifier of the car entity.
   * @returns A promise that resolves to the updated car entity.
   */
  validateAndUpdatePictures(
    { carEntity, pictures, files }: TCarPicturesUpdateOrCreate,
    { id }: IdentifierDto,
  ): IPromiseResponse<IUpdateCarResponse>;

  /**
   * Creates a new car entity.
   * @param car - The car entity to be created.
   * @param files - The files associated with the car entity.
   * @returns A promise that resolves to the created car entity.
   */
  create({ car, files }: TServiceCreateCar): IPromiseResponse<Car>;

  /**
   * Updates an existing car entity.
   * @param files - The files associated with the car entity.
   * @param car - The updated car entity.
   * @param id - The identifier of the car entity.
   * @returns A promise that resolves to the updated car entity.
   */
  update(
    { files, car }: TServiceUpdateCar,
    { id }: IdentifierDto,
  ): IPromiseResponse<IUpdateCarResponse>;

  /**
   * Deletes a car entity.
   * @param id - The identifier of the car entity to be deleted.
   * @returns A promise that resolves to the delete car response.
   */
  delete({ id }: IdentifierDto): IPromiseResponse<IDeleteCarResponse>;

  /**
   * Retrieves all car entities with pagination.
   * @param skip - The number of car entities to skip.
   * @param take - The number of car entities to take.
   * @returns A promise that resolves to the response containing the car entities.
   */
  findAll({
    skip,
    take,
  }: GetAllPaginationDto): IPromiseResponse<IFindAllResponse<Car>>;

  /**
   * Retrieves a car entity by its identifier.
   * @param id - The identifier of the car entity.
   * @returns A promise that resolves to the retrieved car entity.
   */
  findById({ id }: IdentifierDto): IPromiseResponse<Car>;
}
