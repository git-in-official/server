import { PrismaService } from 'src/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { InspirationRepository } from './inspiration.repository';

@Injectable()
export class InspirationPrismaRepository implements InspirationRepository {
  constructor(private prisma: PrismaService) {}

  async findAllTitles() {
    return await this.prisma.inspiration.findMany({
      where: {
        type: 'TITLE',
      },
      select: {
        id: true,
        displayName: true,
      },
    });
  }

  async findAllWords() {
    return await this.prisma.inspiration.findMany({
      where: {
        type: 'WORD',
      },
      select: {
        id: true,
        displayName: true,
      },
    });
  }

  async findAllAudios() {
    return await this.prisma.inspiration.findMany({
      where: {
        type: 'AUDIO',
      },
      select: {
        id: true,
        displayName: true,
      },
    });
  }

  async findAllVideos() {
    return await this.prisma.inspiration.findMany({
      where: {
        type: 'VIDEO',
      },
      select: {
        id: true,
        displayName: true,
      },
    });
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
