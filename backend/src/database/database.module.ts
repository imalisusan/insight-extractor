import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Submission } from './entities/submission.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'sqlite',
        database: configService.get('DATABASE_PATH') || 'database.sqlite',
        entities: [Submission],
        synchronize: true, 
        logging: true,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Submission]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}