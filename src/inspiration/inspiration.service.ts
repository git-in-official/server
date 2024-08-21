import { Injectable, Inject } from '@nestjs/common';
import { InspirationRepository } from './inspiration.repository';

@Injectable()
export class InspirationService {
  constructor(
    @Inject(InspirationRepository)
    private readonly inspirationRepository: InspirationRepository,
  ) {}
  async getTitle() {
    const titles = await this.inspirationRepository.findAllTitle();

    const today = new Date();
    const dateString = today.toISOString().split('T')[0];
    const index = this.getHashedIndex(dateString, titles.length);
    return titles[index];
  }

  async getWord() {
    return {
      word: '오늘의 단어',
    };
  }

  // range가 10이면 0~9까지의 숫자를 반환
  getHashedIndex(dateString: string, range: number) {
    let hash = 0;
    for (let i = 0; i < dateString.length; i++) {
      hash = dateString.charCodeAt(i) + ((hash << 5) - hash);
      hash = hash & hash; // 32비트 정수로 유지
    }
    return Math.abs(hash) % range;
  }
}
