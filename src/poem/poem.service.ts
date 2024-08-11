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
}
