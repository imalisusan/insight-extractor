import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { FileService } from '../file/file.service';

@Module({
  controllers: [UploadController],
  providers: [FileService],
  exports: [FileService],
})
export class UploadModule {}