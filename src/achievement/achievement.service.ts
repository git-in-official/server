import { Inject, Injectable } from '@nestjs/common';
import { AchievementRepository } from './achievement.repository';
import { Achievement } from './types';
import { UserRepository } from '../user/user.repository';

@Injectable()
export class AchievementService {
  constructor(
    @Inject(AchievementRepository)
    private readonly achievementRepository: AchievementRepository,
    @Inject(UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  async getAll(userId: string) {
    await this.checkUserExist(userId);
    const achievements = await this.achievementRepository.findAll();
    const acquiredAchievements =
      await this.achievementRepository.findAllByUserId(userId);

    return this.checkAcqusitionStatus(achievements, acquiredAchievements);
  }

  async getAllByUserId(userId: string) {
    await this.checkUserExist(userId);
    return await this.achievementRepository.findAllByUserId(userId);
  }

  async checkUserExist(userId: string) {
    const user = await this.userRepository.findOneById(userId);
    if (!user) throw 'user not found';
  }

  checkAcqusitionStatus(
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
