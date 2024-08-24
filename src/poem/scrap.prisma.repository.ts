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

  // TODO 쿼리 빌더 추가되면 변경하기.
  async findBestScrapUsersByAuthorId(authorId: string) {
    const result = await this.prisma.$queryRaw<
      { id: string; name: string; icon: string; count: BigInt }[]
    >`
    SELECT u.id, u.name, a.icon, COUNT(s.id)
    FROM "Scrap" s
    JOIN "Poem" p ON s."poemId" = p.id
    JOIN "User" u ON s."userId" = u.id
    LEFT JOIN "Achievement" a ON u.id = a.id
    WHERE p."authorId" = ${authorId}
    GROUP BY u.id, u.name, a.icon
    ORDER BY count DESC
    LIMIT 10;
  `;
    return result.map((data) => ({ ...data, count: Number(data.count) }));
  }

  async delete(id: string): Promise<void> {
    await this.prisma.scrap.delete({
      where: {
        id,
      },
    });
  }
}
