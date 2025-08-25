import { registerEnumType } from '@nestjs/graphql';

export enum AnalysisType {
  SUMMARIZE = 'SUMMARIZE',
  EXTRACT_KEY_POINTS = 'EXTRACT_KEY_POINTS',
}

registerEnumType(AnalysisType, {
  name: 'AnalysisType',
  description: 'The type of analysis to perform on the uploaded file',
});