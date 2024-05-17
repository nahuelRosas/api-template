import { DocumentationPictureDto } from '@picture/application/dto/request/documentation-picture.dto';
import { Picture } from '@picture/domain/picture.domain';

export const PICTURE_MAPPER = 'PICTURE_MAPPER';

export interface IPictureMapper {
  fromDtoToEntity<T extends DocumentationPictureDto>({
    pictureDto,
  }: {
    pictureDto: T;
  }): Picture;
}
