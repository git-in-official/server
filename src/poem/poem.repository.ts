import { themes, interactions } from '../constants/tags';

export interface PoemRepository {
  create(userId: string, data: CreateInput): Promise<{ id: string }>;
  findAllProofreading(): Promise<ProofreadingPoemList>;
  // TODO 타입 나중에 변경
  findOneById(
    id: string,
  ): Promise<(Omit<Poem, 'scraps' | 'author'> & { authorId: string }) | null>;
  updateToPublishedStatus(
    id: string,
    ink: number,
  ): Promise<{ authorId: string }>;
  increasePlayCount(
    id: string,
  ): Promise<{ authorId: string; playCount: number }>;
  increaseScrapCount(id: string): Promise<number>;
  decreaseScrapCount(id: string): Promise<number>;
  countUserDaily(userId: string): Promise<number>;
  countPublishedByUserId(userId: string): Promise<number>;
  findAllPublishedByTag(findInputWithTags: FindInputWithTags): Promise<Poem[]>;
  findAllPublished(findInputWithoutTags: FindInputWithoutTags): Promise<Poem[]>;
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

export type PoemWithOriginalContent = {
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
  authorId: string;
  originalTitle: string | null;
  originalContent: string | null;
  inspiration: {
    id: string;
    displayName: string;
    type: 'TITLE' | 'WORD' | 'AUDIO' | 'VIDEO';
  };
};

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
  author: { id: string; name: string };
  scraps: { id: string }[];
};

export type FindInputWithoutTags = {
  userId: string;
};

export type FindInputWithTags = {
  userId: string;
  themes: (typeof themes)[number][];
  interactions: (typeof interactions)[number][];
};

export const PoemRepository = Symbol('PoemRepository');
