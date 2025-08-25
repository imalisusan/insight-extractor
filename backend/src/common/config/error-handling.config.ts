import { ConfigService } from '@nestjs/config';

export interface ErrorHandlingConfig {
  showStackTrace: boolean;
  logLevel: 'error' | 'warn' | 'info' | 'debug';
  sanitizeErrors: boolean;
  maxErrorMessageLength: number;
}

export const getErrorHandlingConfig = (configService: ConfigService): ErrorHandlingConfig => {
  const nodeEnv = configService.get<string>('NODE_ENV', 'development');
  const isProduction = nodeEnv === 'production';

  return {
    showStackTrace: !isProduction,
    logLevel: isProduction ? 'error' : 'debug',
    sanitizeErrors: isProduction,
    maxErrorMessageLength: isProduction ? 100 : 500,
  };
};

export const ERROR_HANDLING_CONFIG = {
  PRODUCTION: {
    showStackTrace: false,
    logLevel: 'error' as const,
    sanitizeErrors: true,
    maxErrorMessageLength: 100,
  },
  DEVELOPMENT: {
    showStackTrace: true,
    logLevel: 'debug' as const,
    sanitizeErrors: false,
    maxErrorMessageLength: 500,
  },
  TEST: {
    showStackTrace: false,
    logLevel: 'warn' as const,
    sanitizeErrors: true,
    maxErrorMessageLength: 200,
  },
};