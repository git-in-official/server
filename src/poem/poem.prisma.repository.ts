import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Poem, PoemRepository } from './poem.repository';
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
      omit: {
        originalContent: true,
        originalTitle: true,
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

  async findAllProofreading() {
    return this.prisma.poem.findMany({
      where: {
        status: '교정중',
      },
      select: {
        id: true,
        title: true,
      },
    });
  }

  async findOneProofreading(id: string) {
    return this.prisma.poem.findUnique({
      where: {
        id,
      },
      include: {
        inspiration: true,
      },
      omit: {
        inspirationId: true,
      },
    });
  }

  async updateStatus(id: string, status: string) {
    await this.prisma.poem.update({
      where: {
        id,
      },
      data: {
        status,
      },
    });
    return;
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
