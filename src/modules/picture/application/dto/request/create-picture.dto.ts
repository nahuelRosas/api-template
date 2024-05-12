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
import { Picture } from '@/modules/picture/domain/picture.domain';

/**
 * Data transfer object for creating a picture.
 */

export class CreatePictur1eDto implements Picture {
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
  @IsNotEmpty()
  category: Category;

  @IsString()
  @IsNotEmpty()
  url: string;

  @IsString()
  @IsNotEmpty()
  key: string;

  @IsString()
  @IsNotEmpty()
  format: string;

  @IsInt()
  @Min(0)
  @Transform(({ value }) => parseInt(value, 10))
  size: number;

  @IsOptional()
  car?: CarModule;
}
