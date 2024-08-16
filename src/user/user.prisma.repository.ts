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
