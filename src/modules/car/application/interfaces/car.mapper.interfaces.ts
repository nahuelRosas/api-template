import { CreateCarDto } from '@car/application/dto/request/create-car.dto';
import { UpdateCarDto } from '@car/application/dto/request/update-car.dto';
import { Car } from '@car/domain/car.domain';

export const CAR_MAPPER = 'CAR_MAPPER';

/**
 * Interface for the Car Mapper.
 */
export interface ICarMapper {
  /**
   * Converts a DTO object to an entity object.
   * @param carDto The DTO object to convert.
   * @returns The converted Car entity object.
   */
  fromDtoToEntity<T extends CreateCarDto | UpdateCarDto>({
    carDto,
  }: {
    carDto: T;
  }): Car;
}
