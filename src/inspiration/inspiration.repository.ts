export interface InspirationRepository {
  findAllTitles(): Promise<{ title: string }[]>;
  findAllWords(): Promise<{ word: string }[]>;
}

export const InspirationRepository = Symbol('InspirationRepository');
