import { Module } from '@nestjs/common';
import { PoemController } from './poem.controller';
import { PoemService } from './poem.service';
import { PoemRepository } from './poem.repository';
import { AwsModule } from 'src/aws/aws.module';
import { LlmService } from './llm.service';

@Module({
  imports: [AwsModule],
  controllers: [PoemController],
  providers: [PoemService, PoemRepository, LlmService],
})
export class PoemModule {}
