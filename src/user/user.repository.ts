import { PrismaService } from 'src/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}
  async findUserByProvider(provider: 'google' | 'apple', providerId: string) {
    return this.prisma.user.findUnique({
      where: {
        provider_providerId: {
          provider,
          providerId,
        },
      },
    });
  }

  async createUser({
    provider,
    providerId,
    name,
  }: {
    provider: 'google' | 'apple';
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
