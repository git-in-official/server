export interface InspirationRepository {
  findAllTitles(): Promise<{ id: string; title: string }[]>;
  findAllWords(): Promise<{ id: string; word: string }[]>;
  findAllAudios(): Promise<{ id: string; filename: string }[]>;
  findAllVideos(): Promise<{ id: string; filename: string }[]>;
  createTitle(title: string): Promise<void>;
  createWord(word: string): Promise<void>;
  createAudio(filename: string): Promise<void>;
  createVideo(filename: string): Promise<void>;
}

export const InspirationRepository = Symbol('InspirationRepository');
