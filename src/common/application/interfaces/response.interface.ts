import { ConsoleLogger } from '@nestjs/common';

import { IResponse } from '@/common/application/interfaces/common.interfaces';

export type TCreateResponse = <T>({
  message,
  statusCode,
  payload,
}: {
  message: string;
  statusCode: number;
  payload?: T;
}) => IResponse<T>;

export enum EResponseType {
  INTERNAL_SERVER_ERROR = 'InternalServerErrorException',
  BAD_REQUEST = 'BadRequestException',
  UNAUTHORIZED = 'UnauthorizedException',
  FORBIDDEN = 'ForbiddenException',
  NOT_FOUND = 'NotFoundException',
}

export type TErrorResponse = ({
  type,
  message,
  error,
  publicError,
}: {
  type: EResponseType;
  message: string;
  error?: unknown;
  publicError?: boolean;
}) => void;

export interface IResponseService extends ConsoleLogger {
  createResponse: TCreateResponse;
  errorResponse: TErrorResponse;
}

export const RESPONSE_SERVICE = 'RESPONSE_SERVICE';
