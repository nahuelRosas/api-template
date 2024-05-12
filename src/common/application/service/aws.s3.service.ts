import { InternalServerErrorException, Logger } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { S3 } from 'aws-sdk';
import * as uuid from 'uuid';

import { IResponse } from '@/common/application/interfaces/common.interfaces';

import { IPromiseResponse } from '../interfaces/common.interfaces';
import {
  IImagesContainerService,
  IUploadImageResponse,
} from '../repository/images-container.service.interface';

/**
 * Service class for interacting with AWS S3 bucket.
 */
export class AmazonS3Service implements IImagesContainerService {
  private bucket: string;
  private s3: AWS.S3;
  private readonly logger = new Logger(AmazonS3Service.name);

  /**
   * Constructs an instance of AmazonS3Service.
   */
  constructor() {
    // Initialize bucket and S3 client
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
      .then(() => this.logger.log('Bucket exists'))
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
            .then(() => this.logger.log('Bucket created'))
            .catch((error) =>
              this.logger.error(`Error creating bucket: ${error}`),
            );
        } else {
          this.logger.error(`Error checking bucket: ${error}`);
        }
      });
  }

  /**
   * Uploads an image to AWS S3 bucket.
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
      const { Location } = await this.s3.upload(params).promise();
      this.logger.verbose(`Image uploaded successfully: ${Location}`);
      return {
        statusCode: 201,
        success: true,
        message: 'Image uploaded successfully',
        payload: { location: Location, key: imageKey },
      };
    } catch (error) {
      throw new InternalServerErrorException({
        message: `Error uploading image: ${error}`,
        success: false,
      });
    }
  }

  /**
   * Deletes an image from the S3 bucket.
   * @param {Object} params - The parameters for deleting the image.
   * @param {string} params.key - The key of the image to be deleted.
   * @returns {IPromiseResponse<boolean>} A promise that resolves to an object indicating the success of the deletion.
   * @throws {InternalServerErrorException} If there is an error deleting the image.
   */
  async deleteImage({ key }): IPromiseResponse<boolean> {
    try {
      const params: S3.Types.DeleteObjectRequest = {
        Bucket: this.bucket,
        Key: key,
      };
      await this.s3.deleteObject(params).promise();
      this.logger.verbose(`Image deleted successfully: ${key}`);
      return {
        statusCode: 200,
        success: true,
        message: 'Image deleted successfully',
      };
    } catch (error) {
      throw new InternalServerErrorException({
        message: `Error deleting image: ${error}`,
        success: false,
      });
    }
  }

  /**
   * Generates a signed URL for accessing an image in the S3 bucket.
   * @param {Object} params - The parameters for generating the signed URL.
   * @param {string} params.key - The key of the image in the S3 bucket.
   * @returns {IResponse<string>} - The response object containing the generated URL.
   * @throws {InternalServerErrorException} - If there is an error generating the URL.
   */
  getImageUrl({ key }: { key: string }): IResponse<string> {
    try {
      const url = this.s3.getSignedUrl('getObject', {
        Bucket: this.bucket,
        Key: key,
        Expires: 60,
      });

      this.logger.verbose(`Image URL generated successfully: ${url}`);
      return {
        statusCode: 200,
        success: true,
        message: 'Image URL generated successfully',
        payload: url,
      };
    } catch (error) {
      throw new InternalServerErrorException({
        message: `Error generating image URL: ${error}`,
        success: false,
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
        return {
          statusCode: 200,
          success: true,
          message: 'No images to delete',
        };
      const keys = Contents.map((content) => ({ Key: content.Key }));

      await this.s3
        .deleteObjects({
          Bucket: this.bucket,
          Delete: { Objects: keys },
        })
        .promise();

      this.logger.verbose('All images deleted successfully');
      return {
        statusCode: 200,
        success: true,
        message: 'All images deleted successfully',
      };
    } catch (error) {
      throw new InternalServerErrorException({
        message: `Error deleting all images: ${error}`,
        success: false,
      });
    }
  }
}
