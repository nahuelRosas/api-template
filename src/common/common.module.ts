import { Module } from '@nestjs/common';

import { AMAZON_S3_SERVICE } from './application/interfaces/aws.s3.interface';
import { RESPONSE_SERVICE } from './application/interfaces/response.interface';
import { AmazonS3Service } from './application/service/aws.s3.service';
import { ResponseService } from './application/service/response.service';

@Module({
  providers: [
    { useClass: ResponseService, provide: RESPONSE_SERVICE },
    { useClass: AmazonS3Service, provide: AMAZON_S3_SERVICE },
  ],
  exports: [
    { useClass: ResponseService, provide: RESPONSE_SERVICE },
    { useClass: AmazonS3Service, provide: AMAZON_S3_SERVICE },
  ],
})
export class CommonModule {}
