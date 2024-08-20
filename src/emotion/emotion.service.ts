import { Injectable } from '@nestjs/common';
import { emotions } from '../constants/emotions';

@Injectable()
export class EmotionService {
  getAll() {
    return emotions;
  }
}
