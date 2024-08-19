import { Injectable } from '@nestjs/common';
import { Scrap, ScrapRepository } from './scrap.repository';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ScrapPrismaRepository implements ScrapRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(poemId: string, userId: string): Promise<Scrap> {
    return await this.prisma.scrap.create({
      data: {
        poemId,
        userId,
      },
    });
  }

  async findOneByPoemIdAndUserId(
    poemId: string,
    userId: string,
  ): Promise<Scrap | null> {
    return await this.prisma.scrap.findFirst({
      where: {
        poemId,
        userId,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.scrap.delete({
      where: {
        id,
      },
    });
  }
}
