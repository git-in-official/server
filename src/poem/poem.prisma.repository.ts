import { Injectable } from '@nestjs/common';
import { PoemRepository } from './poem.repository';
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
      select: {
        id: true,
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

  async findOneById(id: string) {
    return await this.prisma.poem.findUnique({
      where: { id },
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
      },
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

  async updateToPublishedStatus(id: string, ink: number) {
    const { authorId } = await this.prisma.poem.update({
      where: {
        id,
      },
      data: {
        status: '출판',
        author: {
          update: {
            data: {
              ink: {
                increment: ink,
              },
            },
          },
        },
      },
      select: {
        authorId: true,
      },
    });
    return { authorId };
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

  async findAllPublished({ userId }: { userId: string }) {
    return this.prisma.poem.findMany({
      where: {
        status: '출판',
      },
      orderBy: {
        createdAt: 'desc',
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
        author: {
          select: {
            id: true,
            name: true,
          },
        },
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

  async findAllPublishedByTag(findInput: {
    userId: string;
    themes: string[];
    interactions: string[];
  }) {
    return this.prisma.poem.findMany({
      where: {
        status: '출판',
        OR: [
          {
            themes: {
              hasSome: findInput.themes,
            },
          },
          {
            interactions: {
              hasSome: findInput.interactions,
            },
          },
        ],
      },
      orderBy: {
        createdAt: 'desc',
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
        author: {
          select: {
            id: true,
            name: true,
          },
        },
        scraps: {
          where: {
            userId: findInput.userId,
          },
          select: {
            id: true,
          },
        },
      },
    });
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
