import { EntitySchema } from 'typeorm';

import { baseColumnSchemas } from '@/common/infrastructure/persistence/base.schema';
import { Category } from '@/modules/picture/domain/enums';

import { Picture } from '../../domain/picture.domain';

/**
 * Represents the schema for the Picture entity.
 */
export const PictureSchema = new EntitySchema<Picture>({
  name: 'Picture',
  target: Picture,
  columns: {
    ...baseColumnSchemas,

    /**
     * The title of the picture.
     */
    title: {
      name: 'title',
      type: 'varchar',
      length: 255,
      nullable: false,
    },

    /**
     * The description of the picture.
     */
    description: {
      name: 'description',
      type: 'text',
      nullable: true,
    },

    /**
     * The category of the picture.
     * It can be either a varchar or an enum, depending on the environment.
     */
    category: {
      name: 'category',
      type: process.env.NODE_ENV === 'automated_tests' ? 'varchar' : 'enum',
      enum: Category,
      default: Category.FRONT,
    },

    /**
     * The URL of the picture.
     */
    url: {
      name: 'url',
      type: 'text',
      nullable: false,
    },

    /**
     * The key of the picture.
     */
    key: {
      name: 'key',
      type: 'text',
      nullable: false,
    },

    /**
     * The format of the picture.
     */
    format: {
      name: 'format',
      type: 'varchar',
      length: 10,
      nullable: false,
    },
  },

  relations: {
    /**
     * The relation to the Car entity.
     * Represents a many-to-one relationship.
     */
    car: {
      target: 'Car',
      type: 'many-to-one',
      nullable: true,
    },
  },
});
