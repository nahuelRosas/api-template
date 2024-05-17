import { Inject } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { S3 } from 'aws-sdk';
import * as uuid from 'uuid';

import { IResponse } from '@/common/application/interfaces/common.interfaces';

import { ENVIRONMENT } from '../enum/enviroment.enum';
import {
  IAmazonS3Service,
  IUploadImageResponse,
} from '../interfaces/aws.s3.interface';
import { IPromiseResponse } from '../interfaces/common.interfaces';
import {
  EResponseType,
  IResponseService,
  RESPONSE_SERVICE,
} from '../interfaces/response.interface';

/**
 * Service class for interacting with AWS S3 bucket.
 */
export class AmazonS3Service implements IAmazonS3Service {
  private bucket: string;
  private s3: AWS.S3;

  /**
   * Constructs an instance of AmazonS3Service.
   */
  constructor(
    @Inject(RESPONSE_SERVICE)
    private readonly responseService: IResponseService,
  ) {
    this.responseService.setContext(AmazonS3Service.name);
    this.bucket = process.env.AWS_S3_BUCKET;
    this.s3 = new AWS.S3({
      accessKeyId: process.env.AWS_S3_ACCESS_KEY,
      secretAccessKey: process.env.AWS_S3_SECRET_KEY,
      endpoint: process.env.AWS_S3_ENDPOINT,
      s3ForcePathStyle: true,
    });

    // Check if bucket exists, create it if not (only in development environment)
    if (process.env.NODE_ENV !== 'development') return;
    this.s3
      .headBucket({ Bucket: process.env.AWS_S3_BUCKET })
      .promise()
      .then(() => this.responseService.log('Bucket exists'))
      .catch((error) => {
        if (error.statusCode === 404) {
          this.s3
            .createBucket({
              Bucket: process.env.AWS_S3_BUCKET,
              CreateBucketConfiguration: {
                LocationConstraint: process.env.AWS_S3_REGION,
              },
            })
            .promise()
            .then(() => this.responseService.log('Bucket created'))
            .catch((error) =>
              this.responseService.errorResponse({
                type: EResponseType.INTERNAL_SERVER_ERROR,
                message: `Error creating bucket`,
                error,
              }),
            );
        } else {
          this.responseService.errorResponse({
            type: EResponseType.INTERNAL_SERVER_ERROR,
            message: `Error checking bucket`,
            error,
          });
        }
      });
  }

  /**
   * Uploads an image to AWS S3.
   *
   * @param picture - The picture to be uploaded.
   * @returns A promise that resolves to an object containing the upload response.
   * @throws {InternalServerErrorException} If there is an error uploading the image.
   */
  async uploadImage({ picture }): IPromiseResponse<IUploadImageResponse> {
    try {
      const imageKey = uuid.v4();
      const params: S3.Types.PutObjectRequest = {
        Bucket: this.bucket,
        Key: imageKey,
        Body: picture.buffer,
        ContentType: 'image/jpeg',
        ACL: 'public-read',
      };

      if (process.env.NODE_ENV === ENVIRONMENT.AUTOMATED_TEST) {
        return this.responseService.createResponse({
          statusCode: 201,
          message: 'Image uploaded successfully',
          payload: {
            location: `http://localhost:4566/${imageKey}`,
            key: imageKey,
          },
        });
      }

      const { Location } = await this.s3.upload(params).promise();
      return this.responseService.createResponse({
        statusCode: 201,
        message: 'Image uploaded successfully',
        payload: { location: Location, key: imageKey },
      });
    } catch (error) {
      this.responseService.errorResponse({
        type: EResponseType.INTERNAL_SERVER_ERROR,
        message: `Error uploading image`,
        error,
      });
    }
  }

  /**
   * Deletes an image from the S3 bucket.
   * @param {Object} params - The parameters for deleting the image.
   * @param {string} params.key - The key of the image to be deleted.
   * @returns {Promise<IPromiseResponse<boolean>>} A promise that resolves to an object containing the status code, success flag, and message.
   * @throws {InternalServerErrorException} If there is an error deleting the image.
   */
  async deleteImage({ key }: { key: string }): IPromiseResponse<boolean> {
    try {
      if (process.env.NODE_ENV === ENVIRONMENT.AUTOMATED_TEST) {
        return this.responseService.createResponse({
          statusCode: 200,
          message: 'Image deleted successfully',
          payload: true,
        });
      }

      const params: S3.Types.DeleteObjectRequest = {
        Bucket: this.bucket,
        Key: key,
      };

      await this.s3.deleteObject(params).promise();
      return this.responseService.createResponse({
        statusCode: 200,
        message: 'Image deleted successfully',
        payload: true,
      });
    } catch (error) {
      this.responseService.errorResponse({
        type: EResponseType.INTERNAL_SERVER_ERROR,
        message: `Error deleting image`,
        error,
      });
    }
  }

  getImageUrl({ key }: { key: string }): IResponse<string> {
    try {
      const url = this.s3.getSignedUrl('getObject', {
        Bucket: this.bucket,
        Key: key,
        Expires: 60,
      });
      return this.responseService.createResponse({
        statusCode: 200,
        message: 'Image URL generated successfully',
        payload: url,
      });
    } catch (error) {
      this.responseService.errorResponse({
        type: EResponseType.INTERNAL_SERVER_ERROR,
        message: `Error generating image URL`,
        error,
      });
    }
  }

  /**
   * Deletes all images from the S3 bucket.
   * @returns A promise that resolves to an `IResponse<boolean>` object indicating the success of the operation.
   * @throws Throws an `InternalServerErrorException` if there is an error deleting the images.
   */
  async deleteAllImages(): IPromiseResponse<boolean> {
    try {
      const params: S3.Types.ListObjectsRequest = {
        Bucket: this.bucket,
      };

      const { Contents } = await this.s3.listObjects(params).promise();

      if (!Contents)
        return this.responseService.createResponse({
          statusCode: 200,
          message: 'No images to delete',
          payload: false,
        });

      const keys = Contents.map((content) => ({ Key: content.Key }));

      await this.s3
        .deleteObjects({
          Bucket: this.bucket,
          Delete: { Objects: keys },
        })
        .promise();

      return this.responseService.createResponse({
        statusCode: 200,
        message: 'All images deleted successfully',
        payload: true,
      });
    } catch (error) {
      this.responseService.errorResponse({
        type: EResponseType.INTERNAL_SERVER_ERROR,
        message: `Error deleting images`,
        error,
      });
    }
  }
}
