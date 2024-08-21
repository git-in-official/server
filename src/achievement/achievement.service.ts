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

  // TODO 회원 검색 구현하면, 존재하는 회원인지 검증 코드 추가.
  async getAllByUserId(userId: string) {
    return await this.achievementRepository.findAllByUserId(userId);
  }
}
