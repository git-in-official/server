import { Injectable } from '@nestjs/common';
import { themes, interactions } from './tags';

@Injectable()
export class TagService {
  getAll() {
    return { themes, interactions };
  }
}
