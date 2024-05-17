import { Car } from '@car/domain/car.domain';

export interface IUpdateCarResponse {
  oldCar: Car;
  newCar: Car;
}

export interface IDeleteCarResponse {
  deletedCar: Car | null;
}
