import {
  FuelType,
  TransmissionType,
  VehicleCondition,
  VehicleType,
} from '@car/domain/enums';
import { FileDocumentationDto } from '@picture/application/dto/request/files-documentation.dto';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';

/**
 * Data transfer object for creating a car.
 */
export class CreateCarDto {
  @IsString({ message: 'make is required' })
  @MinLength(1)
  @MaxLength(50)
  make: string;

  @IsString({ message: 'model is required' })
  @MinLength(1)
  @MaxLength(50)
  model: string;

  @IsInt({ message: 'year must be a valid number' })
  @Min(1900, { message: 'year cannot be before 1900' })
  @Max(new Date().getFullYear(), { message: 'year cannot be in the future' })
  @Transform(({ value }) => parseInt(value))
  year: number;

  @IsString({ message: 'color is required' })
  @MinLength(1)
  @MaxLength(20)
  color: string;

  @IsInt({ message: 'mileage must be a valid number' })
  @Min(0, { message: 'mileage cannot be negative' })
  @Transform(({ value }) => parseInt(value))
  mileage: number;

  @IsNotEmpty({ message: 'fuel type is required' })
  @IsEnum(FuelType)
  fuelType: FuelType;

  @IsNotEmpty({ message: 'transmission is required' })
  @IsEnum(TransmissionType)
  transmission: TransmissionType;

  @IsInt({ message: 'seats count must be a valid number' })
  @Min(1, { message: 'seats count must be at least 1' })
  @Transform(({ value }) => parseInt(value))
  seats: number;

  @IsInt({ message: 'price per day must be a valid number' })
  @Min(0, { message: 'price per day cannot be negative' })
  @Transform(({ value }) => parseInt(value))
  pricePerDay: number;

  @IsNotEmpty({ message: 'available is required' })
  @IsBoolean({ message: 'available must be a boolean value' })
  @Transform(({ value }) => value.toString() === 'true')
  available: boolean;

  @IsNotEmpty({ message: 'type is required' })
  @IsEnum(VehicleType)
  type: VehicleType;

  @IsNotEmpty({ message: 'condition is required' })
  @IsEnum(VehicleCondition)
  condition: VehicleCondition;

  @IsString({ message: 'location is required' })
  @MinLength(1)
  @MaxLength(100)
  location: string;

  @IsString({ message: 'license plate is required' })
  @MinLength(1)
  @MaxLength(10)
  licensePlate: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => FileDocumentationDto)
  pictures: FileDocumentationDto;
}
