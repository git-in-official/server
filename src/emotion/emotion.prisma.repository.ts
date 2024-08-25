import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { EmotionRepository } from './emotion.repository';
import { Prisma } from '@prisma/client';

@Injectable()
export class EmotionPrismaRepository implements EmotionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createSelection(userId: string, emotion: string): Promise<void> {
    try {
      await this.prisma.emotionSelection.create({
        data: {
          userId,
          emotion,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        return;
      } else {
        throw error;
      }
    }
  }

  async CountSelection(userId: string): Promise<number> {
    return await this.prisma.emotionSelection.count({
      where: {
        userId,
      },
    });
  }
}
