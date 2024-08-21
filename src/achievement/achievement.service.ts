import { Inject, Injectable } from '@nestjs/common';
import { AchievementRepository } from './achievement.repository';

@Injectable()
export class AchievementService {
  constructor(
    @Inject(AchievementRepository)
    private readonly achievementRepository: AchievementRepository,
  ) {}

  async getAll() {
    return await this.achievementRepository.findAll();
  }
}
