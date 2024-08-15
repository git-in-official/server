import { PrismaService } from 'src/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserRepository {
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
