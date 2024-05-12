import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';

import { IdentifierDto } from '@/common/application/dto/identifier.dto';
import { IMAGES_CONTAINER_SERVICE } from '@/common/application/repository/images-container.service.interface';
import { AmazonS3Service } from '@/common/application/service/aws.s3.service';

import { Category } from '../../domain/enums';
import { Picture } from '../../domain/picture.domain';
import { DocumentationPictureDto } from '../dto/request/documentation-picture.dto';
import {
  IPictureMapper,
  PICTURE_MAPPER,
} from '../interfaces/picture.mapper.interfaces';
import {
  IPictureRepository,
  PICTURE_REPOSITORY,
} from '../interfaces/picture.repository.interfaces';
import {
  IPictureService,
  TServiceCreatePicture,
  TServiceDeletePicture,
  TServiceUpdatePicture,
  TServiceValidateDocumentationPicture,
} from '../interfaces/picture.service.interfaces';
import { ServiceMessage } from '../messages/picture.message';

@Injectable()
export class PictureService implements IPictureService {
  private readonly logger = new Logger(PictureService.name);

  constructor(
    @Inject(PICTURE_REPOSITORY)
    private readonly pictureRepository: IPictureRepository,
    @Inject(IMAGES_CONTAINER_SERVICE)
    private readonly awsS3Service: AmazonS3Service,
    @Inject(PICTURE_MAPPER)
    private readonly pictureMapper: IPictureMapper,
  ) {}

  /**
   * Validates the documentation for the given picture files.
   *
   * @param {TServiceValidateDocumentationPicture} params - The parameters for validating the documentation.
   * @returns {void}
   */
  validateDocumentationPicture({
    files,
    FileDocumentationDto,
  }: TServiceValidateDocumentationPicture): void {
    const errors: string[] = [];
    const logger = this.logger;

    /**
     * Validates the presence of files and logs an error message if any files are missing.
     * @param {Object} params - The parameters for file validation.
     * @param {string[]} params.missingFiles - The list of missing files.
     * @returns {void}
     */
    function validateFiles({ missingFiles }: { missingFiles: string[] }): void {
      if (missingFiles.length > 0) {
        const errorMessage = `${
          ServiceMessage.FILES_REQUIRED_FOR_DOCUMENTATION
        }: ${missingFiles.join(', ')}`;
        logger.error(errorMessage);
        errors.push(errorMessage);
      }
    }

    /**
     * Validates the presence of required documents.
     *
     * @param missingDocuments - An array of missing documents.
     */
    function validateDocuments({
      missingDocuments,
    }: {
      missingDocuments: string[];
    }): void {
      if (missingDocuments.length > 0) {
        const errorMessage = `${
          ServiceMessage.DOCUMENTATION_REQUIRED_FOR_FILES
        }: ${missingDocuments.join(', ')}`;
        logger.error(errorMessage);
        errors.push(errorMessage);
      }
    }

    if (!files || Object.keys(files).length === 0) {
      if (
        FileDocumentationDto &&
        Object.keys(FileDocumentationDto).length > 0
      ) {
        const missingFiles = Object.keys(FileDocumentationDto);
        validateFiles({ missingFiles });
      } else {
        const errorMessage = `${ServiceMessage.FILES_REQUIRED_FOR_DOCUMENTATION}`;
        logger.error(errorMessage);
        errors.push(errorMessage);
      }
    }

    if (
      !FileDocumentationDto ||
      Object.keys(FileDocumentationDto).length === 0
    ) {
      if (files && Object.keys(files).length > 0) {
        const missingDocuments = Object.values(files).map(
          (file) => file.fieldname,
        );
        validateDocuments({ missingDocuments });
      } else {
        const errorMessage = `${ServiceMessage.DOCUMENTATION_REQUIRED_FOR_FILES}`;
        logger.error(errorMessage);
        errors.push(errorMessage);
      }
    }

    if (files && FileDocumentationDto) {
      const fieldNames = Object.values(files).map((file) => file.fieldname);
      const documentsKeys = Object.keys(FileDocumentationDto);

      const missingDocuments = fieldNames.filter(
        (field) => !documentsKeys.includes(field),
      );
      validateDocuments({ missingDocuments });

      const missingFiles = documentsKeys.filter(
        (document) => !fieldNames.includes(document),
      );
      validateFiles({ missingFiles });
    }

    if (errors.length > 0) {
      throw new BadRequestException({
        status: false,
        error: ServiceMessage.BAD_REQUEST,
        message: errors,
        statusCode: 400,
      });
    }
  }

  /**
   * Creates new pictures and saves them to the database.
   * @param {TServiceCreatePicture} options - The options for creating pictures.
   * @param {IdentifierDto} options.id - The identifier of the car.
   * @param {Express.Multer.File[]} options.files - The files to be uploaded.
   * @param {Record<string, DocumentationPictureDto>} options.documentation - The documentation for each file.
   * @returns {Promise<Picture[]>} The created pictures.
   * @throws {Error} If an error occurs while creating the pictures.
   */
  async create(
    { files, documentation }: TServiceCreatePicture,
    { id }: IdentifierDto,
  ): Promise<Picture[]> {
    try {
      const Pictures: Picture[] = [];
      for (const i in files) {
        const { payload } = await this.awsS3Service.uploadImage({
          picture: files[i],
        });
        const key: string = files[i]['fieldname'];
        const documentationKey: DocumentationPictureDto = documentation[key];
        documentationKey.category = Category[key];
        documentationKey.format = files[i]['mimetype'];
        documentationKey.size = files[i]['size'];
        documentationKey.key = payload.key;
        documentationKey.url = payload.location;
        documentationKey.car = { id };
        const documentationMapped = this.pictureMapper.fromDtoToEntity({
          pictureDto: documentationKey,
        });

        const { payload: picture } = await this.pictureRepository.create({
            picture: documentationMapped,
          }),
          pictureResponse = { ...picture };
        Pictures.push(pictureResponse);
      }
      return Pictures;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Updates the pictures associated with a given identifier.
   *
   * @param {TServiceUpdatePicture} param0 - The old and new pictures to update.
   * @param {IdentifierDto} param1 - The identifier of the pictures to update.
   * @returns {Promise<Picture[]>} - A promise that resolves to an array of updated pictures.
   * @throws {Error} - If an error occurs while updating the pictures.
   */
  async update(
    { oldPictures, newPictures }: TServiceUpdatePicture,
    { id }: IdentifierDto,
  ): Promise<Picture[]> {
    try {
      const filteredPictures = oldPictures.filter((picture) =>
        Object.keys(newPictures.documentation).includes(picture.category),
      );
      for (const picture of filteredPictures) {
        await this.awsS3Service.deleteImage({ key: picture.key });
        await this.pictureRepository.delete({ id: picture.id });
      }
      return await this.create(
        {
          files: newPictures.files,
          documentation: newPictures.documentation,
        },
        { id },
      );
    } catch (error) {
      throw error;
    }
  }

  /**
   * Deletes pictures from the AWS S3 bucket and the database.
   * @param pictures - An array of pictures to be deleted.
   * @throws Throws an error if there is an issue deleting the pictures.
   */
  async delete({ pictures }: TServiceDeletePicture): Promise<void> {
    try {
      for (const picture of pictures) {
        await this.awsS3Service.deleteImage({ key: picture.key });
        await this.pictureRepository.delete({ id: picture.id });
      }
    } catch (error) {
      throw error;
    }
  }
}
