import { Type } from 'class-transformer';
import { IsNumber, IsOptional, Min } from 'class-validator';

export class GetAllPaginationDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  take: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  skip: number;
}
