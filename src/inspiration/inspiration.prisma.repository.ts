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

  async createTitle(title: string) {
    await this.prisma.inspiration.create({
      data: {
        type: 'TITLE',
        displayName: title,
      },
    });
    return;
  }

  async createWord(word: string) {
    await this.prisma.inspiration.create({
      data: {
        type: 'WORD',
        displayName: word,
      },
    });
    return;
  }

  async createAudio(filename: string) {
    await this.prisma.inspiration.create({
      data: {
        type: 'AUDIO',
        displayName: filename,
      },
    });
    return;
  }

  async createVideo(filename: string) {
    await this.prisma.inspiration.create({
      data: {
        type: 'VIDEO',
        displayName: filename,
      },
    });
    return;
  }
}
