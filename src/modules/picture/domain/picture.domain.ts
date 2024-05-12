import { Base } from '@/common/domain/base.domain';
import { CarModule } from '@/modules/car/car.module';

import { Category } from './enums';

/**
 * Represents a Picture entity.
 */
export class Picture extends Base {
  /**
   * The title of the picture.
   */
  title: string;

  /**
   * The description of the picture.
   */
  description?: string;

  /**
   * The category of the picture.
   */
  category: Category;

  /**
   * The URL of the picture.
   */
  url: string;

  /**
   * The key of the picture.
   */
  key: string;

  /**
   * The format of the picture.
   */
  format: string;

  /**
   * The size of the picture.
   */
  size: number;

  /**
   * The car module associated with the picture.
   */
  car?: CarModule;
}
