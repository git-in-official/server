import { Module } from '@nestjs/common';
import { AchievementService } from './achievement.service';
import { AchievementController } from './achievement.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AchievementRepository } from './achievement.repository';
import { AchievementPrismaRepository } from './achievement.prisma.repository';

@Module({
  imports: [PrismaModule],
  controllers: [AchievementController],
  providers: [
    AchievementService,
    { provide: AchievementRepository, useClass: AchievementPrismaRepository },
  ],
})
export class AchievementModule {}
