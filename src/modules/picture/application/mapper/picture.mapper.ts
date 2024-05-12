import { BadRequestException, Injectable, Logger } from '@nestjs/common';

import { Picture } from '../../domain/picture.domain';
import { DocumentationPictureDto } from '../dto/request/documentation-picture.dto';
import { IPictureMapper } from '../interfaces/picture.mapper.interfaces';
import { MapperMessage } from '../messages/picture.message';

/**
 * Maps between DTO objects and entity objects for pictures.
 */
@Injectable()
export class PictureMapper implements IPictureMapper {
  private readonly logger = new Logger(PictureMapper.name);

  /**
   * Converts a DTO object to an entity object of type `Picture`.
   * @param pictureDto - The DTO object to convert.
   * @returns The converted `Picture` entity object.
   * @throws `BadRequestException` if the conversion fails.
   */
  fromDtoToEntity<T extends DocumentationPictureDto>({
    pictureDto,
  }: {
    pictureDto: T;
  }): Picture {
    try {
      const newPicture = new Picture();
      const keys = Object.keys(pictureDto) as Array<keyof T & keyof Picture>;
      keys.forEach((key) => {
        if (pictureDto[key] !== undefined) {
          newPicture[key] = pictureDto[key] as Picture[keyof T & keyof Picture];
        }
      });
      return newPicture;
    } catch (error) {
      this.logger.error(
        `${MapperMessage.DTO_TO_ENTITY_CONVERSION_FAILED} ${error.message}`,
      );
      throw new BadRequestException({
        status: false,
        error: MapperMessage.DTO_TO_ENTITY_CONVERSION_FAILED,
        message: error.message,
        statusCode: 400,
      });
    }
  }
}
