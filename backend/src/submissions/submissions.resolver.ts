import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { SubmissionsService } from './submissions.service';
import { Submission } from '../database/entities/submission.entity';
import { CreateSubmissionInput } from './dto/create-submission.input';
import { UpdateSubmissionInput } from './dto/update-submission.input';
import { AnalysisType } from './enums/analysis-type.enum';

@Resolver(() => Submission)
export class SubmissionsResolver {
  constructor(private readonly submissionsService: SubmissionsService) {}

  @Query(() => [Submission], { name: 'submissions' })
  findAll() {
    return this.submissionsService.findAll();
  }

  @Query(() => Submission, { name: 'submission' })
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.submissionsService.findOne(id);
  }

  @Mutation(() => Submission)
  analyzeFile(
    @Args('fileId') fileId: string,
    @Args('analysisType', { type: () => AnalysisType }) analysisType: AnalysisType,
  ) {
    return this.submissionsService.analyzeFile(fileId, analysisType);
  }

  @Mutation(() => Submission)
  updateSubmission(
    @Args('updateSubmissionInput') updateSubmissionInput: UpdateSubmissionInput,
  ) {
    return this.submissionsService.update(
      updateSubmissionInput.id,
      updateSubmissionInput,
    );
  }
}