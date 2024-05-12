import {
  IDeletePictureResponse,
  IUpdatePictureResponse,
} from '@picture/application/interfaces/picture.common.interfaces';
import { Picture } from '@picture/domain/picture.domain';

import { IdentifierDto } from '@common/application/dto/identifier.dto';

import { GetAllPaginationDto } from '@/common/application/dto/get-all-pagination.dto';
import {
  IFindAllResponse,
  IPromiseResponse,
} from '@/common/application/interfaces/common.interfaces';

export const PICTURE_REPOSITORY = 'PICTURE_REPOSITORY';

export type TRepositoryPicture = {
  picture: Partial<Picture>;
};

export interface IPictureRepository {
  create({ picture }: TRepositoryPicture): IPromiseResponse<Picture>;
  update(
    { picture }: TRepositoryPicture,
    { id }: IdentifierDto,
  ): IPromiseResponse<IUpdatePictureResponse>;
  delete({ id }: IdentifierDto): IPromiseResponse<IDeletePictureResponse>;
  findAll({
    skip,
    take,
  }: GetAllPaginationDto): IPromiseResponse<IFindAllResponse<Picture>>;
  findById({ id }: IdentifierDto): IPromiseResponse<Picture>;
}
