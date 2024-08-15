import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class PoemRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createPoem(userId: string, data: Prisma.PoemCreateWithoutAuthorInput) {
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
}
