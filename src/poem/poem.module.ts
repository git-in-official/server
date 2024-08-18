import { Module } from '@nestjs/common';
import { PoemController } from './poem.controller';
import { PoemService } from './poem.service';
import { PoemRepository } from './poem.repository';
import { PoemPrismaRepository } from './poem.prisma.repository';
import { LlmService } from './llm.service';
import { AwsModule } from '../aws/aws.module';

@Module({
  imports: [AwsModule],
  controllers: [PoemController],
  providers: [
    PoemService,
    LlmService,
    {
      provide: PoemRepository,
      useClass: PoemPrismaRepository,
    },
  ],
})
export class PoemModule {}
