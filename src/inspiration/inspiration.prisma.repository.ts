import { PrismaService } from 'src/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { InspirationRepository } from './inspiration.repository';

@Injectable()
export class InspirationPrismaRepository implements InspirationRepository {
  constructor(private prisma: PrismaService) {}

  async findAllTitles() {
    return await this.prisma.titleInspiration.findMany();
  }

  async findAllWords() {
    return await this.prisma.wordInspiration.findMany();
  }
}
