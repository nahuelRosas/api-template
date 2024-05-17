import { Inject, Injectable } from '@nestjs/common';

import {
  EResponseType,
  IResponseService,
  RESPONSE_SERVICE,
} from '@/common/application/interfaces/response.interface';

import { Picture } from '../../domain/picture.domain';
import { DocumentationPictureDto } from '../dto/request/documentation-picture.dto';
import { IPictureMapper } from '../interfaces/picture.mapper.interfaces';
import { MapperMessage } from '../messages/picture.message';

/**
 * Maps between DTO objects and entity objects for pictures.
 */
@Injectable()
export class PictureMapper implements IPictureMapper {
  constructor(
    @Inject(RESPONSE_SERVICE)
    private readonly responseService: IResponseService,
  ) {
    this.responseService.setContext(PictureMapper.name);
  }
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
      newPicture.category = pictureDto.category;
      newPicture.description = pictureDto.description;
      newPicture.format = pictureDto.format;
      newPicture.key = pictureDto.key;
      newPicture.title = pictureDto.title;
      newPicture.url = pictureDto.url;
      newPicture.size = pictureDto.size;
      return newPicture;
    } catch (error) {
      this.responseService.errorResponse({
        type: EResponseType.BAD_REQUEST,
        error: MapperMessage.DTO_TO_ENTITY_CONVERSION_FAILED,
        message: error.message,
      });
    }
  }
}
