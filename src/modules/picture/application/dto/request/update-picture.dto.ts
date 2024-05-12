import { PartialType } from '@nestjs/mapped-types';

import { CreatePictur1eDto } from './create-picture.dto';

export class UpdatePictureDto extends PartialType(CreatePictur1eDto) {}
