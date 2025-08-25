import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubmissionsService } from './submissions.service';
import { SubmissionsResolver } from './submissions.resolver';
import { Submission } from '../database/entities/submission.entity';
import { GeminiService } from '../gemini/gemini.service';
import { FileService } from '../file/file.service';

@Module({
  imports: [TypeOrmModule.forFeature([Submission])],
  providers: [SubmissionsResolver, SubmissionsService, GeminiService, FileService],
  exports: [SubmissionsService, FileService],
})
export class SubmissionsModule {}