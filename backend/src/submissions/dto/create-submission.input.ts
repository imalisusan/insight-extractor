import { InputType, Field } from '@nestjs/graphql';
import { AnalysisType } from '../enums/analysis-type.enum';

@InputType()
export class CreateSubmissionInput {
  @Field()
  fileId: string;

  @Field(() => AnalysisType)
  analysisType: AnalysisType;
}