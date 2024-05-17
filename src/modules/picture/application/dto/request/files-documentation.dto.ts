import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';

import { DocumentationPictureDto } from './documentation-picture.dto';

export class FileDocumentationDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => DocumentationPictureDto)
  FRONT: DocumentationPictureDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => DocumentationPictureDto)
  BACK: DocumentationPictureDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => DocumentationPictureDto)
  LEFT: DocumentationPictureDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => DocumentationPictureDto)
  RIGHT: DocumentationPictureDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => DocumentationPictureDto)
  INSIDE: DocumentationPictureDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => DocumentationPictureDto)
  ENGINE: DocumentationPictureDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => DocumentationPictureDto)
  TRUNK: DocumentationPictureDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => DocumentationPictureDto)
  WHEEL: DocumentationPictureDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => DocumentationPictureDto)
  DASHBOARD: DocumentationPictureDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => DocumentationPictureDto)
  SEAT: DocumentationPictureDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => DocumentationPictureDto)
  OTHER: DocumentationPictureDto;
}
