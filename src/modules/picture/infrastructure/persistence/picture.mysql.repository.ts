import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { GetAllPaginationDto } from '@/common/application/dto/get-all-pagination.dto';
import {
  IFindAllResponse,
  IPromiseResponse,
} from '@/common/application/interfaces/common.interfaces';
import {
  EResponseType,
  IResponseService,
  RESPONSE_SERVICE,
} from '@/common/application/interfaces/response.interface';

import { IdentifierDto } from '../../../../common/application/dto/identifier.dto';
import {
  IDeletePictureResponse,
  IUpdatePictureResponse,
} from '../../application/interfaces/picture.common.interfaces';
import {
  IPictureRepository,
  TRepositoryPicture,
} from '../../application/interfaces/picture.repository.interfaces';
import { RepositoryMessage } from '../../application/messages/picture.message';
import { Picture } from '../../domain/picture.domain';
import { PictureSchema } from './picture.schema';

@Injectable()
export class PictureMysqlRepository implements IPictureRepository {
  constructor(
    @InjectRepository(PictureSchema)
    private readonly pictureRepository: Repository<Picture>,
    @Inject(RESPONSE_SERVICE)
    private readonly responseService: IResponseService,
  ) {
    this.responseService.setContext(PictureMysqlRepository.name);
  }

  /**
   * Creates a new picture in the repository.
   *
   * @param picture - The picture object to be created.
   * @returns A promise that resolves to an IPromiseResponse containing the created picture.
   * @throws InternalServerErrorException if there is an error while creating the picture.
   */
  async create({ picture }: TRepositoryPicture): IPromiseResponse<Picture> {
    try {
      const createdPicture = await this.pictureRepository.save(picture);

      return this.responseService.createResponse({
        statusCode: 201,
        message: `${RepositoryMessage.CREATE_SUCCESS} ${RepositoryMessage.WITH_ID} ${createdPicture.id}`,
        payload: createdPicture,
      });
    } catch (error) {
      this.responseService.errorResponse({
        type: EResponseType.INTERNAL_SERVER_ERROR,
        message: RepositoryMessage.CREATE_ERROR,
        error: error.message,
      });
    }
  }

  /**
   * Updates a picture in the repository.
   *
   * @param {TRepositoryPicture} picture - The updated picture data.
   * @param {IdentifierDto} id - The identifier of the picture to update.
   * @returns {IPromiseResponse<IUpdatePictureResponse>} The response containing the updated picture information.
   * @throws {NotFoundException} If the picture with the specified ID is not found.
   * @throws {InternalServerErrorException} If an error occurs while updating the picture.
   */
  async update(
    { picture }: TRepositoryPicture,
    { id }: IdentifierDto,
  ): IPromiseResponse<IUpdatePictureResponse> {
    try {
      const { payload: oldPicture } = await this.findById({ id });

      if (!oldPicture) {
        this.responseService.errorResponse({
          message: `${RepositoryMessage.NOT_FOUND} ${RepositoryMessage.WITH_ID} ${id}`,
          type: EResponseType.NOT_FOUND,
        });
      }

      await this.pictureRepository.save({ id, ...picture });

      const { payload: updatedPicture } = await this.findById({ id });

      return this.responseService.createResponse({
        statusCode: 200,
        message: `${RepositoryMessage.UPDATE_SUCCESS} ${RepositoryMessage.WITH_ID} ${id}`,
        payload: { oldPicture, newPicture: updatedPicture },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        this.responseService.errorResponse({
          type: EResponseType.INTERNAL_SERVER_ERROR,
          message: RepositoryMessage.UPDATE_ERROR,
          error: error.message,
        });
      }
    }
  }

  /**
   * Deletes a picture.
   * @param id - The ID of the picture to be deleted.
   * @returns A promise that resolves to the deleted picture.
   * @throws NotFoundException if the picture with the specified ID is not found.
   * @throws InternalServerErrorException if an error occurs while deleting the picture.
   */
  async delete({
    id,
  }: IdentifierDto): IPromiseResponse<IDeletePictureResponse> {
    try {
      const { payload } = await this.findById({ id });

      if (!payload) {
        this.responseService.errorResponse({
          type: EResponseType.NOT_FOUND,
          message: `${RepositoryMessage.NOT_FOUND} ${RepositoryMessage.WITH_ID} ${id}`,
        });
      }

      const { affected } = await this.pictureRepository.delete({ id });

      if (affected === 0) {
        this.responseService.errorResponse({
          type: EResponseType.INTERNAL_SERVER_ERROR,
          message: `${RepositoryMessage.DELETE_ERROR} ${RepositoryMessage.WITH_ID} ${id}`,
        });
      }

      return this.responseService.createResponse({
        statusCode: 200,
        message: `${RepositoryMessage.DELETE_SUCCESS} ${RepositoryMessage.WITH_ID} ${id}`,
        payload: { deletedPicture: payload, deletedId: id },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        this.responseService.errorResponse({
          type: EResponseType.INTERNAL_SERVER_ERROR,
          message: RepositoryMessage.DELETE_ERROR,
          error: error.message,
        });
      }
    }
  }

  /**
   * Retrieves all pictures with pagination.
   * @param take - The number of pictures to take.
   * @param skip - The number of pictures to skip.
   * @returns A promise that resolves to an array of pictures and the total count.
   * @throws InternalServerErrorException if an error occurs while retrieving the pictures.
   */
  async findAll({
    take,
    skip,
  }: GetAllPaginationDto): IPromiseResponse<IFindAllResponse<Picture>> {
    try {
      const [pictures, total] = await this.pictureRepository.findAndCount({
        take,
        skip,
        cache: true,
      });

      return this.responseService.createResponse({
        statusCode: 200,
        message: `${RepositoryMessage.FIND_SUCCESS} (${pictures.length} found)`,
        payload: {
          items: pictures,
          total,
          take,
          skip,
        },
      });
    } catch (error) {
      this.responseService.errorResponse({
        type: EResponseType.INTERNAL_SERVER_ERROR,
        message: RepositoryMessage.FIND_ERROR,
        error: error.message,
      });
    }
  }

  /**
   * Retrieves a picture by ID.
   * @param id - The ID of the picture to retrieve.
   * @returns A promise that resolves to the retrieved picture.
   * @throws NotFoundException if the picture with the specified ID is not found.
   * @throws InternalServerErrorException if an error occurs while retrieving the picture.
   */
  async findById({ id }: IdentifierDto): IPromiseResponse<Picture> {
    try {
      const picture = await this.pictureRepository.findOne({
        where: { id },
        cache: true,
      });

      if (!picture) {
        this.responseService.errorResponse({
          type: EResponseType.NOT_FOUND,
          message: `${RepositoryMessage.NOT_FOUND} ${RepositoryMessage.WITH_ID} ${id}`,
        });
      }

      return this.responseService.createResponse({
        statusCode: 200,
        message: `${RepositoryMessage.FIND_SUCCESS} ${RepositoryMessage.WITH_ID} ${id}`,
        payload: picture,
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        this.responseService.errorResponse({
          type: EResponseType.INTERNAL_SERVER_ERROR,
          message: RepositoryMessage.FIND_ERROR,
          error: error.message,
        });
      }
    }
  }
}
