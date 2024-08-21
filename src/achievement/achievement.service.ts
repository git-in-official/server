import { Inject, Injectable } from '@nestjs/common';
import { AchievementRepository } from './achievement.repository';
import { Achievement } from './types';

@Injectable()
export class AchievementService {
  constructor(
    @Inject(AchievementRepository)
    private readonly achievementRepository: AchievementRepository,
  ) {}

  // TODO 회원 검색 구현하면, 존재하는 회원인지 검증 코드 추가.
  async getAll(userId: string) {
    const achievements = await this.achievementRepository.findAll();
    const acquiredAchievements =
      await this.achievementRepository.findAllByUserId(userId);

    return this.checkAqusitionStatus(achievements, acquiredAchievements);
  }

  // TODO 회원 검색 구현하면, 존재하는 회원인지 검증 코드 추가.
  async getAllByUserId(userId: string) {
    return await this.achievementRepository.findAllByUserId(userId);
  }

  checkAqusitionStatus(
    achievements: Achievement[],
    acquiredAchievements: Achievement[],
  ) {
    const acquiredAchievementsIds = acquiredAchievements.map(
      (achievement) => achievement.id,
    );
    return achievements.map((achievement) => ({
      ...achievement,
      isAquired: acquiredAchievementsIds.includes(achievement.id),
    }));
  }
}
