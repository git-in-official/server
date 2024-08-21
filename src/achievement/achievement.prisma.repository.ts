import { Injectable } from '@nestjs/common';
import { AchievementRepository } from './achievement.repository';
import { PrismaService } from '../prisma/prisma.service';

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
}
