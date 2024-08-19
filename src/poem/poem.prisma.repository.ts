import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PoemRepository } from './poem.repository';
import { PrismaService } from '../prisma/prisma.service';

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
