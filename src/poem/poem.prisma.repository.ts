import { Injectable } from '@nestjs/common';
import { PoemRepository, FindInputWithTags } from './poem.repository';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PoemPrismaRepository implements PoemRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, data: CreateInput) {
    return this.prisma.poem.create({
      data: {
        ...data,
        authorId: userId,
      },
      // TODO select으로 변경하기
      omit: {
        originalContent: true,
        originalTitle: true,
        playCount: true,
        scrapCount: true,
      },
    });
  }

  async countUserDaily(userId: string): Promise<number> {
    return this.prisma.poem.count({
      where: {
        authorId: userId,
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
          lt: new Date(new Date().setHours(23, 59, 59, 999)),
        },
      },
    });
  }

  async findOneById(id: string): Promise<{ id: string } | null> {
    return await this.prisma.poem.findUnique({
      where: { id },
    });
  }

  async findAllProofreading() {
    return this.prisma.poem.findMany({
      where: {
        status: '교정중',
      },
      select: {
        id: true,
        title: true,
        author: {
          select: {
            name: true,
          },
        },
        themes: true,
        interactions: true,
        isRecorded: true,
        createdAt: true,
        status: true,
        content: true,
        inspiration: {
          select: {
            id: true,
            type: true,
            displayName: true,
          },
        },
      },
    });
  }

  async findOneProofreading(id: string) {
    return this.prisma.poem.findUnique({
      where: {
        id,
        status: '교정중',
      },
      include: {
        inspiration: true,
      },
      // TODO select으로 변경하기
      omit: {
        inspirationId: true,
        scrapCount: true,
      },
    });
  }

  async updateStatus(id: string, status: string) {
    const { authorId } = await this.prisma.poem.update({
      where: {
        id,
      },
      data: {
        status,
      },
      select: {
        authorId: true,
      },
    });
    return { authorId };
  }

  async findThreeByIndex({ userId, index }: FindInputWithoutEmotion) {
    return this.prisma.poem.findMany({
      take: 3,
      skip: index * 3,
      orderBy: {
        createdAt: 'desc',
      },
      where: {
        status: '출판',
      },
      select: {
        id: true,
        title: true,
        content: true,
        textAlign: true,
        textSize: true,
        textFont: true,
        themes: true,
        interactions: true,
        isRecorded: true,
        inspirationId: true,
        createdAt: true,
        authorId: true,
        scraps: {
          where: {
            userId,
          },
          select: {
            id: true,
          },
        },
      },
    });
  }

  async findNByTagAndIndex(findInputWithTags: FindInputWithTags) {
    return this.prisma.poem.findMany({
      take: findInputWithTags.limit,
      skip: findInputWithTags.index * findInputWithTags.limit,
      orderBy: {
        createdAt: 'desc',
      },
      where: {
        status: '출판',
        OR: [
          {
            themes: {
              hasSome: findInputWithTags.themes,
            },
          },
          {
            interactions: {
              hasSome: findInputWithTags.interactions,
            },
          },
        ],
      },
      select: {
        id: true,
        title: true,
        content: true,
        textAlign: true,
        textSize: true,
        textFont: true,
        themes: true,
        interactions: true,
        isRecorded: true,
        inspirationId: true,
        createdAt: true,
        authorId: true,
        scraps: {
          where: {
            userId: findInputWithTags.userId,
          },
          select: {
            id: true,
          },
        },
      },
    });
  }

  async countPublishedByUserId(userId: string) {
    return await this.prisma.poem.count({
      where: {
        authorId: userId,
        status: '출판',
      },
    });
  }

  async increasePlayCount(id: string) {
    return await this.prisma.poem.update({
      where: {
        id,
      },
      data: {
        playCount: {
          increment: 1,
        },
      },
      select: {
        authorId: true,
        playCount: true,
      },
    });
  }

  async increaseScrapCount(id: string): Promise<number> {
    const result = await this.prisma.poem.update({
      where: {
        id,
      },
      data: {
        scrapCount: {
          increment: 1,
        },
      },
      select: {
        scrapCount: true,
      },
    });

    return result.scrapCount;
  }

  async decreaseScrapCount(id: string): Promise<number> {
    const result = await this.prisma.poem.update({
      where: {
        id,
      },
      data: {
        scrapCount: {
          decrement: 1,
        },
      },
      select: {
        scrapCount: true,
      },
    });

    return result.scrapCount;
  }
}

export type CreateInput = {
  title: string;
  content: string;
  themes: string[];
  interactions: string[];
  textAlign: string;
  textSize: number;
  textFont: string;
  isRecorded: boolean;
  originalContent?: string | null;
  originalTitle?: string | null;
  inspirationId: string;
  status: string;
};

export type FindInputWithoutEmotion = {
  userId: string;
  index: number;
};
