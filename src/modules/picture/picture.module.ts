import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CommonModule } from '@common/common.module';

import { PICTURE_MAPPER } from './application/interfaces/picture.mapper.interfaces';
import { PICTURE_REPOSITORY } from './application/interfaces/picture.repository.interfaces';
import { PICTURE_SERVICE } from './application/interfaces/picture.service.interfaces';
import { PictureMapper } from './application/mapper/picture.mapper';
import { PictureService } from './application/service/picture.service';
import { PictureMysqlRepository } from './infrastructure/persistence/picture.mysql.repository';
import { PictureSchema } from './infrastructure/persistence/picture.schema';

/**
 * Module for managing pictures.
 */
@Module({
  imports: [TypeOrmModule.forFeature([PictureSchema]), CommonModule],
  providers: [
    /**
     * Provider for mapping picture entities to DTOs.
     */
    {
      provide: PICTURE_MAPPER,
      useClass: PictureMapper,
    },
    /**
     * Provider for picture-related services.
     */
    {
      provide: PICTURE_SERVICE,
      useClass: PictureService,
    },
    /**
     * Provider for accessing the picture repository.
     */
    {
      provide: PICTURE_REPOSITORY,
      useClass: PictureMysqlRepository,
    },
  ],
  exports: [
    /**
     * Provider for mapping picture entities to DTOs.
     */
    {
      provide: PICTURE_MAPPER,
      useClass: PictureMapper,
    },
    /**
     * Provider for picture-related services.
     */
    {
      provide: PICTURE_SERVICE,
      useClass: PictureService,
    },
    /**
     * Provider for accessing the picture repository.
     */
    {
      provide: PICTURE_REPOSITORY,
      useClass: PictureMysqlRepository,
    },
  ],
})
export class PictureModule {}
