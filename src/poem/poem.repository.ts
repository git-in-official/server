import { themes, interactions } from '../constants/tags';

export interface PoemRepository {
  create(userId: string, data: CreateInput): Promise<NewPoem>;
  findAllProofreading(): Promise<ProofreadingPoemList>;
  findOneProofreading(id: string): Promise<PoemWithOriginalContent | null>;
  findOneById(id: string): Promise<{ id: string } | null>;
  findThreeByIndex(findInputWithoutTags: FindInputWithoutTags): Promise<Poem[]>;
  findNByTagAndIndex(findInputWithTags: FindInputWithTags): Promise<Poem[]>;
  updateStatus(id: string, status: string): Promise<{ authorId: string }>;
  increasePlayCount(
    id: string,
  ): Promise<{ authorId: string; playCount: number }>;
  increaseScrapCount(id: string): Promise<number>;
  decreaseScrapCount(id: string): Promise<number>;
  countUserDaily(userId: string): Promise<number>;
  countPublishedByUserId(userId: string): Promise<number>;
}

export type CreateInput = {
  title: string;
  content: string;
  themes: string[];
  interactions: string[];
  textAlign: string;
  textSize: number;
  textFont: string;
  isRecorded: boolean;
  originalContent?: string | null;
  originalTitle?: string | null;
  inspirationId: string;
  status: string;
};

export type NewPoem = {
  id: string;
  title: string;
  content: string;
  textAlign: string;
  textSize: number;
  textFont: string;
  themes: string[];
  interactions: string[];
  isRecorded: boolean;
  status: string;
  createdAt: Date;
  inspirationId: string;
  authorId: string;
};

export type ProofreadingPoemList = {
  id: string;
  title: string;
  author: {
    name: string;
  };
  themes: string[];
  interactions: string[];
  isRecorded: boolean;
  createdAt: Date;
  status: string;
  content: string;
  inspiration: {
    id: string;
    type: 'TITLE' | 'WORD' | 'AUDIO' | 'VIDEO';
    displayName: string;
  };
}[];

export type PoemWithOriginalContent = Omit<
  NewPoem & {
    originalTitle: string | null;
    originalContent: string | null;
    inspiration: {
      id: string;
      displayName: string;
      type: 'TITLE' | 'WORD' | 'AUDIO' | 'VIDEO';
    };
  },
  'inspirationId'
>;

export type Poem = {
  id: string;
  title: string;
  content: string;
  textAlign: string;
  textSize: number;
  textFont: string;
  themes: string[];
  interactions: string[];
  isRecorded: boolean;
  createdAt: Date;
  inspirationId: string;
  authorId: string;
  scraps: { id: string }[];
};

export type FindInputWithoutTags = {
  userId: string;
  index: number;
};

export type FindInputWithTags = {
  userId: string;
  index: number;
  limit: number;
  themes: (typeof themes)[number][];
  interactions: (typeof interactions)[number][];
};

export const PoemRepository = Symbol('PoemRepository');
