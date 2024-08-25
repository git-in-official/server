import { Injectable, Inject } from '@nestjs/common';
import { emotions } from '../constants/emotions';
import { EmotionRepository } from './emotion.repository';
import { AchievementRepository } from 'src/achievement/achievement.repository';

@Injectable()
export class EmotionService {
  constructor(
    @Inject(EmotionRepository)
    private readonly emotionRepository: EmotionRepository,
    @Inject(AchievementRepository)
    private readonly achievementRepository: AchievementRepository,
  ) {}
  getAll() {
    return emotions;
  }

  async select(userId: string, emotion: string) {
    await this.emotionRepository.createSelection(userId, emotion);
    const count = await this.emotionRepository.CountSelection(userId);
    if (count >= emotions.length) {
      await this.achievementRepository.acquire(userId, '들쑥날쑥');
    }
    return;
  }
}
