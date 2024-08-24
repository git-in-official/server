import { Injectable } from '@nestjs/common';
import { themes, interactions, firstTags, secondTags } from '../constants/tags';
import { emotions } from 'src/constants/emotions';

@Injectable()
export class TagService {
  getAll() {
    return { themes, interactions };
  }

  getFirstTags(emotion: (typeof emotions)[number]['emotion']) {
    return firstTags.find((tag) => tag.emotion === emotion);
  }

  getSecondTags(emotion: (typeof emotions)[number]['emotion']) {
    return secondTags.find((tag) => tag.emotion === emotion);
  }
}
