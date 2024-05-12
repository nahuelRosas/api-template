import { CreateCarDto } from '@car/application/dto/request/create-car.dto';
import { UpdateCarDto } from '@car/application/dto/request/update-car.dto';
import {
  IDeleteCarResponse,
  IUpdateCarResponse,
} from '@car/application/interfaces/car.common.interfaces';
import { ICarController } from '@car/application/interfaces/car.controller.interfaces';
import {
  CAR_SERVICE,
  ICarService,
} from '@car/application/interfaces/car.service.interfaces';
import { Car } from '@car/domain/car.domain';
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { FileUploadCarDto } from '@picture/application/dto/files-upload-car.dto';
import { fileFilterCallback } from '@picture/application/utils/picture.utils';
import { Category } from '@picture/domain/enums';

import { GetAllPaginationDto } from '@/common/application/dto/get-all-pagination.dto';
import { IdentifierDto } from '@/common/application/dto/identifier.dto';
import {
  IFindAllResponse,
  IPromiseResponse,
} from '@/common/application/interfaces/common.interfaces';

@Controller('car')
export class CarController implements ICarController {
  constructor(
    @Inject(CAR_SERVICE)
    private readonly carService: ICarService,
  ) {}

  /**
   * Create a new car.
   * @param files - The uploaded files for the car.
   * @param car - The car data.
   * @returns A promise that resolves to the created car.
   */
  @Post()
  @UseInterceptors(
    AnyFilesInterceptor({
      fileFilter: (_req, file, cb) => {
        fileFilterCallback({ file, enumType: Category, cb });
      },
    }),
  )
  async create(
    @UploadedFiles() files: FileUploadCarDto,
    @Body() car: CreateCarDto,
  ): IPromiseResponse<Car> {
    try {
      return await this.carService.create({ car, files });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update an existing car.
   * @param files - The uploaded files for the car.
   * @param car - The updated car data.
   * @param id - The ID of the car to update.
   * @returns A promise that resolves to the updated car.
   */
  @Put(':id')
  @UseInterceptors(
    AnyFilesInterceptor({
      fileFilter: (_req, file, cb) => {
        fileFilterCallback({ file, enumType: Category, cb });
      },
    }),
  )
  async update(
    @UploadedFiles() files: FileUploadCarDto,
    @Body() car: UpdateCarDto,
    @Param() { id }: IdentifierDto,
  ): IPromiseResponse<IUpdateCarResponse> {
    try {
      return await this.carService.update({ car, files }, { id });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete a car.
   * @param id - The ID of the car to delete.
   * @returns A promise that resolves to the delete car response.
   */
  @Delete(':id')
  async delete(
    @Param() { id }: IdentifierDto,
  ): IPromiseResponse<IDeleteCarResponse> {
    try {
      return await this.carService.delete({
        id,
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get all cars.
   * @param skip - The number of cars to skip.
   * @param take - The number of cars to take.
   * @returns A promise that resolves to the find all cars response.
   */
  @Get()
  async findAll(
    @Query() { skip, take }: GetAllPaginationDto,
  ): IPromiseResponse<IFindAllResponse<Car>> {
    try {
      return await this.carService.findAll({
        skip,
        take,
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find a car by ID.
   * @param id - The ID of the car to find.
   * @returns A promise that resolves to the found car.
   */
  @Get(':id')
  async findById(@Param() { id }: IdentifierDto): IPromiseResponse<Car> {
    try {
      return await this.carService.findById({
        id,
      });
    } catch (error) {
      throw error;
    }
  }
}
