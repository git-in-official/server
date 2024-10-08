import { Prisma } from '@prisma/client';

export interface ScrapRepository {
  create(poemId: string, userId: string): Promise<Scrap>;
  findOneByPoemIdAndUserId(
    poemId: string,
    userId: string,
  ): Promise<Scrap | null>;
  delete(id: string): Promise<void>;
  findBestScrapUsersByAuthorId(userId: string): Promise<ScrapUser[]>;
  countByUserId(userId: string): Promise<number>;
}

export type Scrap = {
  id: string;
  userId: string;
  poemId: string;
  createdAt: Date;
};

type ScrapUser = { id: string; name: string; icon: string; count: number };

export const ScrapRepository = Symbol('ScrapRepository');
