import { CreateCarDto } from '@car/application/dto/request/create-car.dto';
import { UpdateCarDto } from '@car/application/dto/request/update-car.dto';
import { ICarMapper } from '@car/application/interfaces/car.mapper.interfaces';
import { Car } from '@car/domain/car.domain';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';

import { MapperMessage } from '@/modules/picture/application/messages/picture.message';

@Injectable()
export class CarMapper implements ICarMapper {
  private readonly logger = new Logger(CarMapper.name);

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
      const keys = Object.keys(carDto) as Array<keyof T & keyof Car>;
      keys.forEach((key) => {
        if (carDto[key] !== undefined) {
          newCar[key] = carDto[key] as Car[keyof T & keyof Car];
        }
      });
      return newCar;
    } catch (error) {
      this.logger.error(
        `${MapperMessage.DTO_TO_ENTITY_CONVERSION_FAILED} ${error.message}`,
      );
      throw new BadRequestException({
        success: false,
        error: MapperMessage.DTO_TO_ENTITY_CONVERSION_FAILED,
        message: error.message,
        statusCode: 400,
      });
    }
  }
}
