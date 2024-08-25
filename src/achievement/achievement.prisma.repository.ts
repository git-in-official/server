import { Injectable } from '@nestjs/common';
import { AchievementRepository } from './achievement.repository';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class AchievementPrismaRepository implements AchievementRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.achievement.findMany({
      omit: {
        createdAt: true,
      },
    });
  }

  async findAllByUserId(userId: string) {
    return await this.prisma.achievementAcquisition
      .findMany({
        where: { userId },
        select: {
          achievement: {
            omit: {
              createdAt: true,
            },
          },
        },
      })
      .then((list) => list.map((data) => data.achievement));
  }

  async acquire(userId: string, achievementName: string) {
    const achievement = await this.prisma.achievement.findUnique({
      where: { name: achievementName },
    });
    if (!achievement) {
      throw new Error('해당 업적이 존재하지 않습니다.');
    }

    try {
      await this.prisma.achievementAcquisition.create({
        data: {
          userId,
          achievementId: achievement.id,
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
}
