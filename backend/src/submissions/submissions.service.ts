import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Submission } from '../database/entities/submission.entity';
import { UpdateSubmissionInput } from './dto/update-submission.input';
import { AnalysisType } from './enums/analysis-type.enum';
import { GeminiService } from '../gemini/gemini.service';
import { FileService } from '../file/file.service';
import { SubmissionNotFoundException, AnalysisFailedException } from '../common/exceptions/business.exceptions';

@Injectable()
export class SubmissionsService {
  constructor(
    @InjectRepository(Submission)
    private submissionRepository: Repository<Submission>,
    private geminiService: GeminiService,
    private fileService: FileService,
  ) {}

  async findAll(): Promise<Submission[]> {
    return this.submissionRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Submission> {
    const submission = await this.submissionRepository.findOne({
      where: { id },
    });
    if (!submission) {
      throw new SubmissionNotFoundException(id);
    }
    return submission;
  }

  async analyzeFile(fileId: string, analysisType: AnalysisType): Promise<Submission> {
    try {
      const fileData = await this.fileService.getFileData(fileId);
      
      const analysis = await this.geminiService.analyzeText(
        fileData.content,
        analysisType,
      );

      const submission = this.submissionRepository.create({
        originalFilename: fileData.filename,
        geminiSummary: analysis.summary,
        geminiKeyPoints: analysis.keyPoints,
      });

      return this.submissionRepository.save(submission);
    } catch (error) {
      if (error instanceof SubmissionNotFoundException || 
          error instanceof AnalysisFailedException) {
        throw error;
      }
      
      throw new AnalysisFailedException(error.message);
    }
  }

  async update(
    id: string,
    updateSubmissionInput: UpdateSubmissionInput,
  ): Promise<Submission> {
    const submission = await this.findOne(id);
    
    if (updateSubmissionInput.userEditedSummary !== undefined) {
      submission.userEditedSummary = updateSubmissionInput.userEditedSummary;
    }
    
    if (updateSubmissionInput.userEditedKeyPoints !== undefined) {
      submission.userEditedKeyPoints = updateSubmissionInput.userEditedKeyPoints;
    }

    return this.submissionRepository.save(submission);
  }
}