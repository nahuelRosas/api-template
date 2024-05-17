export enum RepositoryMessage {
  CREATE_SUCCESS = 'Car created successfully',
  CREATE_ERROR = 'Error creating car',
  FIND_SUCCESS = 'Found cars',
  FIND_ERROR = 'Error finding cars',
  NOT_FOUND = 'Car not found',
  UPDATE_SUCCESS = 'Car updated successfully',
  UPDATE_ERROR = 'Error updating car',
  DELETE_SUCCESS = 'Car deleted successfully',
  DELETE_ERROR = 'Error deleting car',
  WITH_ID = 'with ID',
}

export enum ServiceMessage {
  FILES_REQUIRED_FOR_DOCUMENTATION = 'File is required for the following documentation cars',
  DOCUMENTATION_REQUIRED_FOR_FILES = 'Documentation is required for the following files',
}

export enum UtilsMessage {
  INVALID_FILE_TYPE = 'Invalid file type',
  INVALID_FIELD_NAME = 'Invalid field name',
  VALID_FILE_TYPES = ', valid file types are:',
  VALID_FIELD_NAMES = ', valid field names are:',
}
