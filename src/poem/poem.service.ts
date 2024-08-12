import { Injectable } from '@nestjs/common';

@Injectable()
export class PoemService {
  async analysisPoem(title: string, content: string) {
    // 시 분석 로직
    title;
    content;
    return {
      emotions: ['내적 갈등', '사랑', '상실', '위로'],
    };
  }

  async changeEmotion({
    title,
    beforeEmotion,
    afterEmotion,
    content,
  }: {
    title: string;
    beforeEmotion: string[];
    afterEmotion: string[];
    content: string;
  }) {
    // 감정 수정 로직
    title;
    beforeEmotion;
    afterEmotion;
    content;

    return {
      content: '감정에 맞춰 수정된 시 입니다.\n' + content,
    };
  }
}
