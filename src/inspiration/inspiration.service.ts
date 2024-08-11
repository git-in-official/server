import { Injectable } from '@nestjs/common';

@Injectable()
export class InspirationService {
  async getTitle() {
    return {
      title: '오늘의 글감',
    };
  }

  async getWord() {
    return {
      word: '오늘의 단어',
    };
  }
}
