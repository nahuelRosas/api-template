import { Car } from '@car/domain/car.domain';
import {
  FuelType,
  TransmissionType,
  VehicleCondition,
  VehicleType,
} from '@car/domain/enums';
import { EntitySchema } from 'typeorm';

import { baseColumnSchemas } from '@/common/infrastructure/persistence/base.schema';

/**
 * CarSchema is the database schema for the Car entity.
 */
export const CarSchema = new EntitySchema<Car>({
  name: 'Car',
  target: Car,
  columns: {
    ...baseColumnSchemas,

    /**
     * The make of the car.
     */
    make: {
      name: 'make',
      type: 'varchar',
      length: 255,
      nullable: false,
    },

    /**
     * The model of the car.
     */
    model: {
      name: 'model',
      type: 'varchar',
      length: 255,
      nullable: false,
    },

    /**
     * The year of the car.
     */
    year: {
      name: 'year',
      type: 'int',
      default: new Date().getFullYear(),
    },

    /**
     * The color of the car.
     */
    color: {
      name: 'color',
      type: 'varchar',
      length: 255,
      nullable: false,
    },

    /**
     * The mileage of the car.
     */
    mileage: {
      name: 'mileage',
      type: 'int',
      default: 0,
    },

    /**
     * The fuel type of the car.
     */
    fuelType: {
      name: 'fuelType',
      type: process.env.NODE_ENV === 'automated_tests' ? 'varchar' : 'enum',
      enum: FuelType,
      default: FuelType.GASOLINE,
    },

    /**
     * The transmission type of the car.
     */
    transmission: {
      name: 'transmission',
      type: process.env.NODE_ENV === 'automated_tests' ? 'varchar' : 'enum',
      enum: TransmissionType,
      default: TransmissionType.MANUAL,
    },

    /**
     * The number of seats in the car.
     */
    seats: {
      name: 'seats',
      type: 'int',
      default: 5,
    },

    /**
     * The price per day to rent the car.
     */
    pricePerDay: {
      name: 'pricePerDay',
      type: 'int',
      default: 0,
    },

    /**
     * Indicates if the car is available for rent.
     */
    available: {
      name: 'available',
      type: 'boolean',
      default: false,
    },

    /**
     * The type of the car (e.g., sedan, SUV, etc.).
     */
    type: {
      name: 'type',
      type: process.env.NODE_ENV === 'automated_tests' ? 'varchar' : 'enum',
      enum: VehicleType,
      default: VehicleType.SEDAN,
    },

    /**
     * The condition of the car (e.g., new, used, etc.).
     */
    condition: {
      name: 'condition',
      type: process.env.NODE_ENV === 'automated_tests' ? 'varchar' : 'enum',
      enum: VehicleCondition,
      default: VehicleCondition.NEW,
    },

    /**
     * The location of the car.
     */
    location: {
      name: 'location',
      type: 'text',
      nullable: false,
    },

    /**
     * The license plate of the car.
     */
    licensePlate: {
      name: 'licensePlate',
      type: 'varchar',
      length: 10,
      nullable: false,
    },
  },
  relations: {
    /**
     * The pictures associated with the car.
     */
    pictures: {
      nullable: true,
      type: 'one-to-many',
      target: 'Picture',
      joinColumn: {
        name: 'car_id',
      },
      inverseSide: 'car',
    },
  },
});
