import { Picture } from '@picture/domain/picture.domain';

export interface IUpdatePictureResponse {
  oldPicture: Picture;
  newPicture: Picture;
}

export interface IDeletePictureResponse {
  deletedPicture: Picture | null;
  deletedId: number;
}
