import { Injectable, Inject } from '@nestjs/common';
import { InspirationRepository } from './inspiration.repository';
import { title } from 'node:process';

@Injectable()
export class InspirationService {
  constructor(
    @Inject(InspirationRepository)
    private readonly inspirationRepository: InspirationRepository,
  ) {}
  async getTitle(today: Date) {
    const titles = await this.inspirationRepository.findAllTitles();
    const length = titles.length;
    const dateString = today.toISOString().split('T')[0];

    if (length === 0) {
      throw new Error('no inspiration');
    }

    const index = this.getHashedIndex(dateString, length);
    return {
      id: titles[index].id,
      title: titles[index].title,
    };
  }

  async getWord(date: Date) {
    const words = await this.inspirationRepository.findAllWords();
    const length = words.length;
    const dateString = date.toISOString().split('T')[0];

    if (length === 0) {
      throw new Error('no inspiration');
    }

    const index = this.getHashedIndex(dateString, length);
    return {
      id: words[index].id,
      word: words[index].word,
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
