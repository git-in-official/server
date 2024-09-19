export interface InspirationRepository {
  findAllTitles(): Promise<Inspiration[]>;
  findAllWords(): Promise<Inspiration[]>;
  findAllAudios(): Promise<Inspiration[]>;
  findAllVideos(): Promise<Inspiration[]>;
  createTitle(title: string): Promise<void>;
  createWord(word: string): Promise<void>;
  createAudio(filename: string): Promise<void>;
  createVideo(filename: string): Promise<void>;
}

export const InspirationRepository = Symbol('InspirationRepository');

export interface Inspiration {
  id: string;
  displayName: string;
}
