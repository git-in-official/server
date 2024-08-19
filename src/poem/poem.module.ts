import { Module } from '@nestjs/common';
import { PoemController } from './poem.controller';
import { PoemService } from './poem.service';
import { PoemRepository } from './poem.repository';
import { PoemPrismaRepository } from './poem.prisma.repository';
import { LlmService } from './llm.service';
import { AwsModule } from '../aws/aws.module';
import { ScrapRepository } from './scrap.repository';
import { ScrapPrismaRepository } from './scrap.prisma.repository';

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
    {
      provide: ScrapRepository,
      useClass: ScrapPrismaRepository,
    },
  ],
})
export class PoemModule {}
