import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as fs from 'fs';
import { join } from 'path';
import * as request from 'supertest';

import { loadFixtures } from '@data/util/loader';

import { AppModule } from '@/app.module';

describe('Car API', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    await loadFixtures({
      fixturesPath: `${__dirname}/fixture`,
      dataSourcePath: join(
        __dirname,
        '..',
        '..',
        '..',
        '..',
        'configuration/orm.configuration.ts',
      ),
    });

    app = moduleRef.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );
    await app.init();
  });

  const samplePicture = {
    id: 1,
    title: 'titulo',
    description: 'description',
    category: 'FRONT',
    url: 'http://localhost:4566/local/8617ad4f-2e30-4d93-b2e6-a79f7fdfbb84',
    key: '8617ad4f-2e30-4d93-b2e6-a79f7fdfbb84',
    format: 'image/jpeg',
  };

  const sampleCar = {
    make: 'Toyota',
    model: 'Corolla',
    year: 2018,
    color: 'Red',
    mileage: 35000,
    fuelType: 'Gasoline',
    transmission: 'Automatic',
    seats: 5,
    pricePerDay: 50,
    available: true,
    type: 'Sedan',
    condition: 'Used',
    location: 'Los Angeles',
    licensePlate: 'ABC123',
  };

  const expectedCars = expect.arrayContaining([
    expect.objectContaining({
      ...sampleCar,
      id: 1,
      pictures: expect.arrayContaining([
        expect.objectContaining(samplePicture),
      ]),
    }),
  ]);

  const expectedCar = expect.objectContaining({
    ...sampleCar,
    id: 2,
    pictures: expect.arrayContaining([
      expect.objectContaining({
        ...samplePicture,
        id: 2,
        key: expect.anything(),
        url: expect.anything(),
      }),
    ]),
  });

  describe('Get all cars', () => {
    it('should return an array of cars', async () => {
      const response = await makeGetRequest({ endpoint: '/car' });
      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('statusCode', HttpStatus.OK);
      expect(response.body).toHaveProperty('message');
      expect(response.body.payload.items).toEqual(expectedCars);
    });
  });

  describe('Get one car', () => {
    it('should return a car', async () => {
      const response = await makeGetRequest({ endpoint: '/car/1' });
      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('statusCode', HttpStatus.OK);
      expect(response.body).toHaveProperty('message');
      expect(response.body.payload).toEqual(expect.objectContaining(sampleCar));
    });

    it('should return a not found error', async () => {
      const response = await makeGetRequest({ endpoint: '/car/100' });
      expect(response.status).toBe(HttpStatus.NOT_FOUND);
      expect(response.body).toEqual({
        success: false,
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Car not found with ID 100',
      });
    });
  });

  describe('Create a car', () => {
    it('should create a car', async () => {
      const response = await makePostRequest({
        endpoint: '/car',
        method: 'post',
        files: {
          FRONT: fs.createReadStream(
            `${__dirname}/fixture/toyota-corolla-front.jpg`,
          ),
        },
        data: {
          ...sampleCar,
          pictures: {
            FRONT: {
              title: 'titulo',
              description: 'description',
            },
          },
        },
      });
      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('statusCode', HttpStatus.CREATED);
      expect(response.body).toHaveProperty('message');
      expect(response.body.payload).toEqual(expectedCar);
    });

    it('should return a bad request error', async () => {
      const response = await makePostRequest({
        endpoint: '/car',
        method: 'post',
        files: {
          FRONT: fs.createReadStream(
            `${__dirname}/fixture/toyota-corolla-front.jpg`,
          ),
        },
        data: {
          ...sampleCar,
          pictures: {
            FRONT: {
              description: 'description',
            },
          },
        },
      });
      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      expect(response.body).toEqual({
        statusCode: HttpStatus.BAD_REQUEST,
        error: 'Bad Request',
        message: expect.arrayContaining([
          'pictures.FRONT.title must be shorter than or equal to 100 characters',
          'pictures.FRONT.title must be longer than or equal to 3 characters',
          'pictures.FRONT.title should not be empty',
          'pictures.FRONT.title must be a string',
        ]),
      });
    });
  });

  describe('Update a car', () => {
    it('should update a car', async () => {
      const response = await makePostRequest({
        endpoint: '/car/2',
        method: 'put',
        files: {
          FRONT: fs.createReadStream(
            `${__dirname}/fixture/toyota-corolla-front.jpg`,
          ),
        },
        data: {
          ...sampleCar,
          pictures: {
            FRONT: {
              title: 'titulo',
              description: 'description',
            },
          },
        },
      });
      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('statusCode', HttpStatus.OK);
      expect(response.body).toHaveProperty('message');
      expect(response.body.payload).toEqual({
        newCar: expect.objectContaining({
          ...sampleCar,
          id: 2,
          pictures: expect.arrayContaining([
            expect.objectContaining({
              ...samplePicture,
              id: 3,
              key: expect.anything(),
              url: expect.anything(),
            }),
          ]),
        }),
        oldCar: expectedCar,
      });
    });

    it('should return a not found error', async () => {
      const response = await makePostRequest({
        endpoint: '/car/100',
        method: 'put',
        files: {
          FRONT: fs.createReadStream(
            `${__dirname}/fixture/toyota-corolla-front.jpg`,
          ),
        },
        data: {
          ...sampleCar,
          pictures: {
            FRONT: {
              title: 'titulo',
              description: 'description',
            },
          },
        },
      });
      expect(response.status).toBe(HttpStatus.NOT_FOUND);
      expect(response.body).toEqual({
        success: false,
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Car not found with ID 100',
      });
    });
  });

  describe('Delete a car', () => {
    it('should delete a car', async () => {
      const response = await request(app.getHttpServer()).delete('/car/2');
      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('statusCode', HttpStatus.OK);
      expect(response.body).toHaveProperty('message');
      expect(response.body.payload).toEqual({
        deletedCar: expect.objectContaining({
          ...sampleCar,
          id: 2,
          pictures: expect.arrayContaining([
            expect.objectContaining({
              ...samplePicture,
              id: 3,
              key: expect.anything(),
              url: expect.anything(),
            }),
          ]),
        }),
      });
    });

    it('should return a not found error', async () => {
      const response = await request(app.getHttpServer()).delete('/car/100');
      expect(response.status).toBe(HttpStatus.NOT_FOUND);
      expect(response.body).toEqual({
        success: false,
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Car not found with ID 100',
      });
    });
  });

  afterAll(async () => {
    await app.close();
  });

  // Helper functions

  async function makeGetRequest({ endpoint }: { endpoint: string }) {
    try {
      return await request(app.getHttpServer()).get(endpoint);
    } catch (error) {
      console.log(error);
    }
  }

  type Primitive = string | number | boolean;
  type NestedObject = Record<string, Primitive | Record<string, Primitive>>;
  type DataObject = Record<string, Primitive | NestedObject>;
  type FilesObject = Record<string, fs.ReadStream>;

  /**
   * Makes a POST or PUT request to the specified endpoint with optional data and files.
   * @param method - The HTTP method to use, either 'post' or 'put'.
   * @param endpoint - The endpoint URL to send the request to.
   * @param data - Optional data object to include in the request body.
   * @param files - Optional files object to include as attachments in the request.
   * @returns A Promise that resolves to the response of the request.
   * @throws An error if an invalid method is provided or if there is an error making the request.
   */
  async function makePostRequest({
    method,
    endpoint,
    data,
    files,
  }: {
    method: 'post' | 'put';
    endpoint: string;
    data?: DataObject;
    files?: FilesObject;
  }) {
    try {
      if (!['post', 'put'].includes(method)) {
        throw new Error('Invalid method');
      }

      const requestBuilder =
        method === 'post'
          ? request(app.getHttpServer()).post(endpoint)
          : request(app.getHttpServer()).put(endpoint);

      if (data) {
        buildDataFields({ requestBuilder, data });
      }

      if (files) {
        buildFileAttachments({ requestBuilder, files });
      }

      return await requestBuilder.set('Content-Type', 'multipart/form-data');
    } catch (error) {
      console.error('Error making request:', error);
      throw error;
    }
  }

  /**
   * Builds data fields for a request using the provided request builder and data object.
   * If a value in the data object is an object itself, it recursively builds nested fields.
   * Otherwise, it adds the field to the request builder.
   *
   * @param requestBuilder The request builder object.
   * @param data The data object containing the fields to be built.
   */
  function buildDataFields({
    requestBuilder,
    data,
  }: {
    requestBuilder: request.Test;
    data: DataObject;
  }): void {
    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'object') {
        buildNestedFields({ requestBuilder, key, value });
      } else {
        requestBuilder.field(key, value);
      }
    }
  }

  /**
   * Builds nested fields for a request builder.
   *
   * @param options - The options for building nested fields.
   * @param options.requestBuilder - The request builder object.
   * @param options.key - The key for the nested fields.
   * @param options.value - The value for the nested fields.
   */
  function buildNestedFields({
    requestBuilder,
    key,
    value,
  }: {
    requestBuilder: request.Test;
    key: string;
    value: NestedObject;
  }): void {
    for (const [subKey, subValue] of Object.entries(value)) {
      if (typeof subValue === 'object') {
        for (const [k, v] of Object.entries(subValue)) {
          requestBuilder.field(`${key}[${subKey}][${k}]`, v);
        }
      } else {
        requestBuilder.field(`${key}[${subKey}]`, subValue);
      }
    }
  }

  /**
   * Builds file attachments for a request.
   *
   * @param requestBuilder - The request builder object.
   * @param files - The files to attach.
   */
  function buildFileAttachments({
    requestBuilder,
    files,
  }: {
    requestBuilder: request.Test;
    files: FilesObject;
  }): void {
    for (const [key, value] of Object.entries(files)) {
      requestBuilder.attach(key, value, { filename: key });
    }
  }
});
