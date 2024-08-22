import { PrismaService } from 'src/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { InspirationRepository } from './inspiration.repository';

@Injectable()
export class InspirationPrismaRepository implements InspirationRepository {
  constructor(private prisma: PrismaService) {}

  async findAllTitles() {
    const result = await this.prisma.inspiration.findMany({
      where: {
        type: 'TITLE',
      },
    });
    return result.map((item) => ({
      id: item.id,
      title: item.displayName,
    }));
  }

  async findAllWords() {
    const result = await this.prisma.inspiration.findMany({
      where: {
        type: 'WORD',
      },
    });
    return result.map((item) => ({
      id: item.id,
      word: item.displayName,
    }));
  }
}
