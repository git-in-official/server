import { Module } from '@nestjs/common';
import { InspirationController } from './inspiration.controller';
import { InspirationService } from './inspiration.service';
import { InspirationRepository } from './inspiration.repository';
import { InspirationPrismaRepository } from './inspiration.prisma.repository';
import { AwsModule } from 'src/aws/aws.module';

@Module({
  imports: [AwsModule],
  controllers: [InspirationController],
  providers: [
    InspirationService,
    {
      provide: InspirationRepository,
      useClass: InspirationPrismaRepository,
    },
  ],
  exports: [InspirationService],
})
export class InspirationModule {}
