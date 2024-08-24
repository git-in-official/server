import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserRepository } from './user.repository';

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
    return this.prisma.user
      .findUnique({
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
      })
      .then((data) =>
        data
          ? {
              ...data,
              achievements: data.achievements.map((a) => a.achievement),
            }
          : null,
      );
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
}
