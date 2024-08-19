import { Prisma } from '@prisma/client';

export interface ScrapRepository {
  create(poemId: string, userId: string): Promise<Scrap>;
  findOneByPoemIdAndUserId(
    poemId: string,
    userId: string,
  ): Promise<Scrap | null>;
  delete(id: string): Promise<void>;
}

export type Scrap = {
  id: string;
  userId: string;
  poemId: string;
  createdAt: Date;
};

export const ScrapRepository = Symbol('ScrapRepository');
