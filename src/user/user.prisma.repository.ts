import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserData, UserRepository } from './user.repository';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserPrismaRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}
  async findOneByProvider(provider: 'GOOGLE' | 'APPLE', providerId: string) {
    return this.prisma.user.findUnique({
      where: {
        provider_providerId: {
          provider,
          providerId,
        },
      },
    });
  }

  async findOneDetailById(id: string) {
    const result = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        ink: true,
        introduction: true,
        mainAchievement: {
          select: {
            id: true,
            name: true,
            icon: true,
            description: true,
          },
        },
        achievements: {
          select: {
            achievement: {
              select: {
                id: true,
                name: true,
                icon: true,
                description: true,
              },
            },
          },
        },
      },
    });

    return result
      ? {
          ...result,
          achievements: result.achievements.map((a) => a.achievement),
        }
      : null;
  }

  async findOneById(id: string): Promise<{ id: string } | null> {
    return await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
      },
    });
  }

  async create({
    provider,
    providerId,
    name,
  }: {
    provider: 'GOOGLE' | 'APPLE';
    providerId: string;
    name: string;
  }) {
    return this.prisma.user.create({
      data: {
        provider,
        providerId,
        name,
      },
    });
  }

  async update(userId: string, data: UpdateUserData): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data,
    });
  }

  async updateMainAchievement(
    userId: string,
    achievementId: string,
  ): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        mainAchievementId: achievementId,
      },
    });
  }

  async createAccessHistory(userId: string): Promise<void> {
    try {
      await this.prisma.userAccessHistory.create({
        data: {
          userId,
        },
      });
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2002'
      ) {
        return;
      }
      throw e;
    }
  }

  async countAccessHistoryRecentTenDays(
    userId: string,
    date: Date = new Date(),
  ): Promise<number> {
    const tenDaysAgo = new Date(date);
    tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);
    return this.prisma.userAccessHistory.count({
      where: {
        userId,
        date: {
          gte: tenDaysAgo,
        },
      },
    });
  }
}
