import { HttpException, HttpStatus } from '@nestjs/common';

export class FileNotFoundException extends HttpException {
  constructor(fileId: string) {
    super(
      {
        message: `File not found`,
        code: 'FILE_NOT_FOUND',
        details: 'The requested file could not be located',
      },
      HttpStatus.NOT_FOUND,
    );
  }
}

export class SubmissionNotFoundException extends HttpException {
  constructor(submissionId: string) {
    super(
      {
        message: `Submission not found`,
        code: 'SUBMISSION_NOT_FOUND',
        details: 'The requested submission could not be located',
      },
      HttpStatus.NOT_FOUND,
    );
  }
}

export class AnalysisFailedException extends HttpException {
  constructor(reason?: string) {
    super(
      {
        message: 'Analysis failed',
        code: 'ANALYSIS_FAILED',
        details: 'The AI analysis could not be completed. Please try again later.',
      },
      HttpStatus.SERVICE_UNAVAILABLE,
    );
  }
}

export class FileUploadException extends HttpException {
  constructor(reason: string) {
    super(
      {
        message: 'File upload failed',
        code: 'FILE_UPLOAD_FAILED',
        details: reason,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}


export class InvalidFileTypeException extends HttpException {
  constructor(allowedTypes: string[] = ['text/plain']) {
    super(
      {
        message: 'Invalid file type',
        code: 'INVALID_FILE_TYPE',
        details: `Only ${allowedTypes.join(', ')} files are allowed`,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class FileSizeExceededException extends HttpException {
  constructor(maxSize: string = '5MB') {
    super(
      {
        message: 'File size exceeded',
        code: 'FILE_SIZE_EXCEEDED',
        details: `File size must not exceed ${maxSize}`,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class ExternalApiException extends HttpException {
  constructor(service: string, reason?: string) {
    super(
      {
        message: 'External service unavailable',
        code: 'EXTERNAL_SERVICE_ERROR',
        details: `The ${service} service is currently unavailable. Please try again later.`,
      },
      HttpStatus.SERVICE_UNAVAILABLE,
    );
  }
}