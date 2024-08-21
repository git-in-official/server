import { Module } from '@nestjs/common';
import { InspirationController } from './inspiration.controller';
import { InspirationService } from './inspiration.service';
import { InspirationRepository } from './inspiration.repository';
import { InspirationPrismaRepository } from './inspiration.prisma.repository';

@Module({
  controllers: [InspirationController],
  providers: [
    InspirationService,
    {
      provide: InspirationRepository,
      useClass: InspirationPrismaRepository,
    },
  ],
})
export class InspirationModule {}
