import {
  BadRequestException,
  ConsoleLogger,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Scope,
  UnauthorizedException,
} from '@nestjs/common';

import {
  IResponseService,
  TCreateResponse,
  TErrorResponse,
} from '../interfaces/response.interface';

@Injectable({ scope: Scope.TRANSIENT })
export class ResponseService extends ConsoleLogger implements IResponseService {
  /**
   * Creates a response object with the provided message, status code, and payload.
   *
   * @param message - The message to include in the response.
   * @param statusCode - The status code of the response.
   * @param payload - The payload to include in the response.
   * @returns The response object.
   */
  createResponse: TCreateResponse = ({ message, statusCode, payload }) => {
    this.log(`Message: ${message}`);

    return {
      success: statusCode >= 200 && statusCode < 300,
      statusCode,
      message,
      payload,
    };
  };

  /**
   * Handles error responses based on the provided type.
   *
   * @param type - The type of error.
   * @param message - The error message.
   * @param error - The error object.
   * @throws {InternalServerErrorException} - If the type is 'InternalServerErrorException'.
   * @throws {BadRequestException} - If the type is 'BadRequestException'.
   * @throws {UnauthorizedException} - If the type is 'UnauthorizedException'.
   * @throws {ForbiddenException} - If the type is 'ForbiddenException'.
   * @throws {NotFoundException} - If the type is 'NotFoundException'.
   * @throws {InternalServerErrorException} - If the type is not recognized.
   */
  errorResponse: TErrorResponse = ({
    type,
    message,
    error,
    publicError = false,
  }) => {
    this.error(`Message: ${message}`);
    if (error) this.error(`Error: ${error}`);

    switch (type) {
      case 'InternalServerErrorException':
        throw new InternalServerErrorException({
          statusCode: 500,
          message,
          success: false,
          error: publicError ? error : undefined,
        });
      case 'BadRequestException':
        throw new BadRequestException({
          statusCode: 400,
          message,
          success: false,
          error: publicError ? error : undefined,
        });
      case 'UnauthorizedException':
        throw new UnauthorizedException({
          statusCode: 401,
          message,
          success: false,
          error: publicError ? error : undefined,
        });
      case 'ForbiddenException':
        throw new ForbiddenException({
          statusCode: 403,
          message,
          success: false,
          error: publicError ? error : undefined,
        });
      case 'NotFoundException':
        throw new NotFoundException({
          statusCode: 404,
          message,
          success: false,
          error: publicError ? error : undefined,
        });
      default:
        throw new InternalServerErrorException({
          statusCode: 500,
          message,
          success: false,
          error: publicError ? error : undefined,
        });
    }
  };
}
