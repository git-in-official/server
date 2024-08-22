export interface InspirationRepository {
  findAllTitles(): Promise<{ id: string; title: string }[]>;
  findAllWords(): Promise<{ id: string; word: string }[]>;
}

export const InspirationRepository = Symbol('InspirationRepository');
