export interface PoemRepository {
  create(userId: string, data: CreateInput): Promise<NewPoem>;
  countUserDaily(userId: string): Promise<number>;
  findAllProofreading(): Promise<ProofreadingPoemList>;
  findOneProofreading(id: string): Promise<PoemWithOriginalContent | null>;
  updateStatus(id: string, status: string): Promise<void>;
  findThreeByIndex(
    findInputWithoutEmotion: FindInputWithoutEmotion,
  ): Promise<Poem[]>;
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

export type FindInputWithoutEmotion = {
  userId: string;
  index: number;
};

export const PoemRepository = Symbol('PoemRepository');
