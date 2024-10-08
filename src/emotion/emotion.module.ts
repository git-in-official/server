import { Module } from '@nestjs/common';
import { EmotionController } from './emotion.controller';
import { EmotionService } from './emotion.service';
import { EmotionRepository } from './emotion.repository';
import { EmotionPrismaRepository } from './emotion.prisma.repository';
import { AchievementModule } from 'src/achievement/achievement.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [AchievementModule, UserModule],
  controllers: [EmotionController],
  providers: [
    EmotionService,
    {
      provide: EmotionRepository,
      useClass: EmotionPrismaRepository,
    },
  ],
})
export class EmotionModule {}
