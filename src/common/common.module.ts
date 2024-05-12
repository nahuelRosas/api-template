import { Module } from '@nestjs/common';

import { IMAGES_CONTAINER_SERVICE } from './application/repository/images-container.service.interface';
import { AmazonS3Service } from './application/service/aws.s3.service';

@Module({
  providers: [{ useClass: AmazonS3Service, provide: IMAGES_CONTAINER_SERVICE }],
  exports: [{ useClass: AmazonS3Service, provide: IMAGES_CONTAINER_SERVICE }],
})
export class CommonModule {}
