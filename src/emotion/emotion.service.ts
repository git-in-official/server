import { Injectable } from '@nestjs/common';
import { emotionList } from './emotion-list';

@Injectable()
export class EmotionService {
  getAll() {
    return emotionList;
  }
}
