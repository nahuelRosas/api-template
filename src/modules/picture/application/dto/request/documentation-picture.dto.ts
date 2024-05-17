import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

import { CarModule } from '@/modules/car/car.module';
import { Category } from '@/modules/picture/domain/enums';

export class DocumentationPictureDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  title: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  description: string;

  @IsEnum(Category)
  @IsOptional()
  category: Category;

  @IsString()
  @IsOptional()
  url: string;

  @IsString()
  @IsOptional()
  key: string;

  @IsString()
  @IsOptional()
  format: string;

  @IsInt()
  @Min(0)
  @Transform(({ value }) => parseInt(value, 10))
  @IsOptional()
  size: number;

  @IsOptional()
  car?: CarModule;
}
