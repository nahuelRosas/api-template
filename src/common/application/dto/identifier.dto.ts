import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class IdentifierDto {
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Transform(({ value }) => parseInt(value))
  id: number;
}
