import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { AnalysisType } from '../submissions/enums/analysis-type.enum';
import { ExternalApiException } from '../common/exceptions/business.exceptions';

export interface AnalysisResult {
  summary: string;
  keyPoints: string;
}

@Injectable()
export class GeminiService {
  private genAI: GoogleGenerativeAI;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not configured');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async analyzeText(content: string, analysisType: AnalysisType): Promise<AnalysisResult> {
    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      let summary = '';
      let keyPoints = '';

      if (analysisType === AnalysisType.SUMMARIZE || analysisType === AnalysisType.EXTRACT_KEY_POINTS) {
        const summaryPrompt = `Please provide a concise summary of the following text:\n\n${content}`;
        const summaryResult = await model.generateContent(summaryPrompt);
        const summaryResponse = await summaryResult.response;
        summary = summaryResponse.text();

        const keyPointsPrompt = `Please extract the key points from the following text as a bulleted list:\n\n${content}`;
        const keyPointsResult = await model.generateContent(keyPointsPrompt);
        const keyPointsResponse = await keyPointsResult.response;
        keyPoints = keyPointsResponse.text();
      }

      return { summary, keyPoints };
    } catch (error) {
      console.error('Gemini API Error:', error);
      
      throw new ExternalApiException('Gemini AI', 'Analysis service temporarily unavailable');
    }
  }
}