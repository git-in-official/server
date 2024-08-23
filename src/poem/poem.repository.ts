export interface PoemRepository {
  create(userId: string, data: CreateInput): Promise<Poem>;
  countUserDaily(userId: string): Promise<number>;
  findAllProofreading(): Promise<ProofreadingPoemList>;
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
  status: string;
  createdAt: Date;
  inspirationId: string;
  authorId: string;
};

export type ProofreadingPoemList = {
  id: string;
  title: string;
}[];

export const PoemRepository = Symbol('PoemRepository');
