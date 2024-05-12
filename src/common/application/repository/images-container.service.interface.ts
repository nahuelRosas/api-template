import { IResponse } from '@/common/application/interfaces/common.interfaces';

export interface IUploadImageResponse {
  location: string;
  key: string;
}

/**
 * Represents the interface for the Images Container Service.
 */
/**
 * Interface for the ImagesContainerService.
 */
export interface IImagesContainerService {
  /**
   * Uploads an image to the container.
   * @param picture - The image file to upload.
   * @returns A promise that resolves to the response containing the upload image details.
   */
  uploadImage({
    picture,
  }: {
    picture: Express.Multer.File;
  }): Promise<IResponse<IUploadImageResponse>>;

  /**
   * Deletes an image from the container.
   * @param key - The key of the image to delete.
   * @returns A promise that resolves to the response indicating if the image was successfully deleted.
   */
  deleteImage({ key }: { key: string }): Promise<IResponse<boolean>>;

  /**
   * Retrieves the URL of an image from the container.
   * @param key - The key of the image.
   * @returns The response containing the URL of the image.
   */
  getImageUrl({ key }: { key: string }): IResponse<string>;

  /**
   * Deletes all images from the container.
   * @returns A promise that resolves to the response indicating if all images were successfully deleted.
   */
  deleteAllImages(): Promise<IResponse<boolean>>;
}

export const IMAGES_CONTAINER_SERVICE = 'IMAGES_CONTAINER_SERVICE';
