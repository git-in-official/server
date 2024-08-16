import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { PoemRepository } from './poem.repository';

@Injectable()
export class PoemPrismaRepository implements PoemRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, data: Prisma.PoemCreateWithoutAuthorInput) {
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
