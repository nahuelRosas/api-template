import { FileUploadCarDto } from '@picture/application/dto/files-upload-car.dto';
import { FileDocumentationDto } from '@picture/application/dto/request/files-documentation.dto';
import { Picture } from '@picture/domain/picture.domain';

import { IdentifierDto } from '@/common/application/dto/identifier.dto';

export const PICTURE_SERVICE = 'PICTURE_SERVICE';

export type TServiceValidateDocumentationPicture = {
  files?: FileUploadCarDto;
  FileDocumentationDto?: FileDocumentationDto;
};

export type TServiceCreatePicture = {
  files: FileUploadCarDto;
  documentation: FileDocumentationDto;
};

export type TServiceDeletePicture = {
  pictures: Picture[];
};

export type TServiceUpdatePicture = {
  oldPictures: Picture[];
  newPictures: {
    files: FileUploadCarDto;
    documentation: FileDocumentationDto;
  };
};

export interface IPictureService {
  validateDocumentationPicture({
    files,
    FileDocumentationDto,
  }: TServiceValidateDocumentationPicture): void;
  create(
    { files, documentation }: TServiceCreatePicture,
    { id }: IdentifierDto,
  ): Promise<Picture[]>;
  update(
    { oldPictures, newPictures }: TServiceUpdatePicture,
    { id }: IdentifierDto,
  ): Promise<Picture[]>;
  delete({ pictures }: TServiceDeletePicture): Promise<void>;
}
