export interface IFindAllOptions {
  take?: number;
  skip?: number;
}

export interface IFindAllResponse<T> {
  items: T[];
  total: number;
  take: number;
  skip: number;
}

export interface IResponse<T> {
  message: string;
  success: boolean;
  statusCode: number;
  payload?: T;
}

export type IPromiseResponse<T> = Promise<IResponse<T>>;
