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

    const scrapUsers = await this.scrapRepository.findBestScrapperByUserId(id);

    return {
      ...user,
      scrapUsers,
    };
  }
}
