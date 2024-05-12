import { CAR_MAPPER } from '@car/application/interfaces/car.mapper.interfaces';
import { CAR_REPOSITORY } from '@car/application/interfaces/car.repository.interfaces';
import { CAR_SERVICE } from '@car/application/interfaces/car.service.interfaces';
import { CarMapper } from '@car/application/mapper/car.mapper';
import { CarService } from '@car/application/service/car.service';
import { CarMysqlRepository } from '@car/infrastructure/persistence/car.mysql.repository';
import { CarSchema } from '@car/infrastructure/persistence/car.schema';
import { CarController } from '@car/interface/car.controller';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PictureModule } from '@picture/picture.module';

import { CommonModule } from '@common/common.module';

/**
 * Module responsible for managing cars.
 */
@Module({
  imports: [TypeOrmModule.forFeature([CarSchema]), CommonModule, PictureModule],
  controllers: [CarController],
  providers: [
    /**
     * Provider for the car mapper.
     */
    {
      provide: CAR_MAPPER,
      useClass: CarMapper,
    },
    /**
     * Provider for the car service.
     */
    {
      provide: CAR_SERVICE,
      useClass: CarService,
    },
    /**
     * Provider for the car repository.
     */
    {
      provide: CAR_REPOSITORY,
      useClass: CarMysqlRepository,
    },
  ],
  exports: [
    /**
     * Provider for the car mapper.
     */
    {
      provide: CAR_MAPPER,
      useClass: CarMapper,
    },
    /**
     * Provider for the car service.
     */
    {
      provide: CAR_SERVICE,
      useClass: CarService,
    },
    /**
     * Provider for the car repository.
     */
    {
      provide: CAR_REPOSITORY,
      useClass: CarMysqlRepository,
    },
  ],
})
export class CarModule {}
