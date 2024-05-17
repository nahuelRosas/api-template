export enum RepositoryMessage {
  CREATE_SUCCESS = 'Picture created successfully',
  CREATE_ERROR = 'Error creating picture',
  FIND_SUCCESS = 'Found pictures',
  FIND_ERROR = 'Error finding pictures',
  NOT_FOUND = 'Picture not found',
  UPDATE_SUCCESS = 'Picture updated successfully',
  UPDATE_ERROR = 'Error updating picture',
  DELETE_SUCCESS = 'Picture deleted successfully',
  DELETE_ERROR = 'Error deleting picture',
  WITH_ID = 'with ID',
}

export enum ServiceMessage {
  BAD_REQUEST = 'Bad request, check files and documentation',
  FILES_REQUIRED_FOR_DOCUMENTATION = 'File is required for the following documentation pictures',
  DOCUMENTATION_REQUIRED_FOR_FILES = 'Documentation is required for the following files',
}

export enum UtilsMessage {
  INVALID_FILE_TYPE = 'Invalid file type',
  INVALID_FIELD_NAME = 'Invalid field name',
  VALID_FILE_TYPES = ', valid file types are:',
  NO_MIME_TYPE = 'No mime type found',
  VALID_FIELD_NAMES = ', valid field names are:',
}

export enum MapperMessage {
  DTO_TO_ENTITY_CONVERSION_FAILED = 'Failed to convert DTO to entity:',
}
