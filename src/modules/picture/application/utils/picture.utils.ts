import {
  BadRequestException,
  FileTypeValidator,
  InternalServerErrorException,
} from '@nestjs/common';
import { IFile } from '@nestjs/common/pipes/file/interfaces';

import { UtilsMessage } from '../messages/picture.message';

export const ImageRegex = /(jpg|jpeg|png|webp)$/;

/**
 * Callback function used for filtering files based on their properties.
 *
 * @param options - The options object containing the file, enumType, cb, and validTypes properties.
 * @param options.file - The file object representing the uploaded file.
 * @param options.enumType - An object containing the allowed field names and their corresponding values.
 * @param options.cb - The callback function to be called with the result of the file filtering.
 * @param options.validTypes - Optional. A regular expression representing the valid file types.
 */
export function fileFilterCallback({
  file,
  enumType,
  cb,
  validTypes = ImageRegex,
}: {
  file: Partial<Express.Multer.File>;
  enumType: Record<string, string>;
  cb: (error: Error | null, acceptFile: boolean) => void;
  validTypes?: RegExp;
}): void {
  const fieldName: string = file.fieldname;
  const validator = new FileTypeValidator({
    fileType: validTypes,
  });
  if (!file.mimetype) {
    throw new InternalServerErrorException({
      status: false,
      message: UtilsMessage.NO_MIME_TYPE,
    });
  }
  if (!validator.isValid(file as IFile)) {
    cb(
      new BadRequestException({
        status: false,
        message: `${UtilsMessage.INVALID_FILE_TYPE}: ${file.mimetype}`,
        payload: {
          [UtilsMessage.VALID_FILE_TYPES]: validTypes.toString(),
        },
      }),
      false,
    );
  } else if (!enumType[fieldName]) {
    cb(
      new BadRequestException({
        status: false,
        statusCode: 400,
        error: `${UtilsMessage.INVALID_FIELD_NAME}: ${fieldName}`,
        message: {
          [UtilsMessage.VALID_FIELD_NAMES]: Object.keys(enumType).toString(),
        },
      }),
      false,
    );
  } else {
    cb(null, true);
  }
}
