import { Injectable } from '@nestjs/common';
import { emotionList } from './emotion-list';

@Injectable()
export class EmotionService {
  getEmotions() {
    return emotionList;
  }
}
