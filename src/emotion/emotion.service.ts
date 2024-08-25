import { Injectable, Inject } from '@nestjs/common';
import { emotions } from '../constants/emotions';
import { EmotionRepository } from './emotion.repository';
import { AchievementRepository } from 'src/achievement/achievement.repository';
import { UserRepository } from 'src/user/user.repository';

@Injectable()
export class EmotionService {
  constructor(
    @Inject(EmotionRepository)
    private readonly emotionRepository: EmotionRepository,
    @Inject(AchievementRepository)
    private readonly achievementRepository: AchievementRepository,
    @Inject(UserRepository)
    private readonly userRepository: UserRepository,
  ) {}
  // 매일 그대와 업적 획득 로직 포함
  async getAll(userId: string) {
    await this.userRepository.createAccessHistory(userId);
    const count =
      await this.userRepository.countAccessHistoryRecentTenDays(userId);
    if (count >= 10) {
      await this.achievementRepository.acquire(userId, '매일 그대와');
    }
    return emotions;
  }

  // 들쑥날쑥 업적 획득로직 포함
  async select(userId: string, emotion: string) {
    await this.emotionRepository.createSelection(userId, emotion);
    const count = await this.emotionRepository.CountSelection(userId);
    if (count >= emotions.length) {
      await this.achievementRepository.acquire(userId, '들쑥날쑥');
    }
    return;
  }
}
