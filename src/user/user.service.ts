import { Injectable, Inject } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { ScrapRepository } from '../poem/scrap.repository';

@Injectable()
export class UserService {
  constructor(
    @Inject(UserRepository)
    private readonly userRepository: UserRepository,
    @Inject(ScrapRepository)
    private readonly scrapRepository: ScrapRepository,
  ) {}

  async getOneDetailById(id: string) {
    const user = await this.userRepository.findOneDetailById(id);
    if (!user) throw Error('user not found');
    const scrapUsers =
      await this.scrapRepository.findBestScrapUsersByAuthorId(id);

    return {
      ...user,
      scrapUsers,
    };
  }

  async update(userId: string, data: UpdateUserInput) {
    const user = await this.userRepository.findOneById(userId);
    if (!user) throw Error('user not found');

    await this.userRepository.update(userId, data);
  }

  async updateMainAchievement(userId: string, achievementId: string) {
    await this.getUserOrThrow(userId);
    await this.userRepository.updateMainAchievement(userId, achievementId);
  }

  private async getUserOrThrow(userId: string) {
    const user = await this.userRepository.findOneById(userId);
    if (!user) throw Error('user not found');

    return user;
  }
}

type UpdateUserInput = {
  name: string;
  introduction?: string | null;
};
