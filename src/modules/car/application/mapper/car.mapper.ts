import { CreateCarDto } from '@car/application/dto/request/create-car.dto';
import { UpdateCarDto } from '@car/application/dto/request/update-car.dto';
import { ICarMapper } from '@car/application/interfaces/car.mapper.interfaces';
import { Car } from '@car/domain/car.domain';
import { Inject, Injectable } from '@nestjs/common';

import {
  EResponseType,
  IResponseService,
  RESPONSE_SERVICE,
} from '@/common/application/interfaces/response.interface';
import { MapperMessage } from '@/modules/picture/application/messages/picture.message';

@Injectable()
export class CarMapper implements ICarMapper {
  constructor(
    @Inject(RESPONSE_SERVICE)
    private readonly responseService: IResponseService,
  ) {
    this.responseService.setContext(CarMapper.name);
  }
  /**
   * Converts a DTO object to an entity object.
   * @param carDto - The DTO object to convert.
   * @returns The converted entity object.
   * @throws BadRequestException if the conversion fails.
   */
  public fromDtoToEntity<T extends CreateCarDto | UpdateCarDto>({
    carDto,
  }: {
    carDto: T;
  }): Car {
    try {
      const newCar = new Car();
      newCar.available = carDto.available;
      newCar.color = carDto.color;
      newCar.condition = carDto.condition;
      newCar.fuelType = carDto.fuelType;
      newCar.licensePlate = carDto.licensePlate;
      newCar.location = carDto.location;
      newCar.make = carDto.make;
      newCar.mileage = carDto.mileage;
      newCar.model = carDto.model;
      newCar.seats = carDto.seats;
      newCar.transmission = carDto.transmission;
      newCar.pricePerDay = carDto.pricePerDay;
      newCar.type = carDto.type;
      newCar.year = carDto.year;
      return newCar;
    } catch (error) {
      this.responseService.errorResponse({
        type: EResponseType.BAD_REQUEST,
        message: MapperMessage.DTO_TO_ENTITY_CONVERSION_FAILED,
        error,
      });
    }
  }
}
