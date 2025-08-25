import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from '../file/file.service';
import { InvalidFileTypeException, FileUploadException, FileSizeExceededException } from '../common/exceptions/business.exceptions';

@Controller('upload')
export class UploadController {
  constructor(private readonly fileService: FileService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: (req, file, cb) => {
        if (file.mimetype !== 'text/plain') {
          cb(new InvalidFileTypeException(['text/plain']), false);
          return;
        }
        cb(null, true);
      },
      limits: {
      fileSize: 5 * 1024 * 1024,
    },
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new FileUploadException('No file provided in the request');
    }

    try {
      const fileId = await this.fileService.saveFile(file);
      return {
        success: true,
        fileId,
        message: 'File uploaded successfully',
      };
    } catch (error) {
      console.error('File upload error:', error);
      
      if (error.code === 'LIMIT_FILE_SIZE') {
          throw new FileSizeExceededException('5MB');
        }
        
        throw new FileUploadException('File processing failed');
    }
  }
}