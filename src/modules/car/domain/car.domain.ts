import {
  FuelType,
  TransmissionType,
  VehicleCondition,
  VehicleType,
} from '@car/domain/enums';

import { Base } from '@/common/domain/base.domain';
import { Picture } from '@/modules/picture/domain/picture.domain';

/**
 * Represents a Car object.
 */
export class Car extends Base {
  /** The make of the car. */
  make: string;
  /** The model of the car. */
  model: string;
  /** The year of the car. */
  year: number;
  /** The color of the car. */
  color: string;
  /** The mileage of the car. */
  mileage: number;
  /** The fuel type of the car. */
  fuelType: FuelType;
  /** The transmission type of the car. */
  transmission: TransmissionType;
  /** The number of seats in the car. */
  seats: number;
  /** The price per day to rent the car. */
  pricePerDay: number;
  /** Indicates if the car is available for rent. */
  available: boolean;
  /** The type of vehicle. */
  type: VehicleType;
  /** The condition of the vehicle. */
  condition: VehicleCondition;
  /** The location of the car. */
  location: string;
  /** The license plate of the car. */
  licensePlate: string;
  /** The pictures of the car. */
  pictures: Picture[];
}
