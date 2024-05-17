import { IsArray, IsOptional, ValidateNested } from 'class-validator';

export class FileUploadCarDto {
  @IsArray()
  @IsOptional()
  @ValidateNested()
  FRONT: Express.Multer.File[];

  @IsArray()
  @IsOptional()
  @ValidateNested()
  BACK: Express.Multer.File[];

  @IsArray()
  @IsOptional()
  @ValidateNested()
  LEFT: Express.Multer.File[];

  @IsArray()
  @IsOptional()
  @ValidateNested()
  RIGHT: Express.Multer.File[];

  @IsArray()
  @IsOptional()
  @ValidateNested()
  INSIDE: Express.Multer.File[];

  @IsArray()
  @IsOptional()
  @ValidateNested()
  ENGINE: Express.Multer.File[];

  @IsArray()
  @IsOptional()
  @ValidateNested()
  TRUNK: Express.Multer.File[];

  @IsArray()
  @IsOptional()
  @ValidateNested()
  WHEEL: Express.Multer.File[];

  @IsArray()
  @IsOptional()
  @ValidateNested()
  DASHBOARD: Express.Multer.File[];

  @IsArray()
  @IsOptional()
  @ValidateNested()
  SEAT: Express.Multer.File[];

  @IsArray()
  @IsOptional()
  @ValidateNested()
  OTHER: Express.Multer.File[];
}
