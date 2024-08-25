export interface InspirationRepository {
  findAllTitles(): Promise<{ id: string; type: string; title: string }[]>;
  findAllWords(): Promise<{ id: string; type: string; word: string }[]>;
  findAllAudios(): Promise<{ id: string; type: string; filename: string }[]>;
  findAllVideos(): Promise<{ id: string; type: string; filename: string }[]>;
  createTitle(title: string): Promise<void>;
  createWord(word: string): Promise<void>;
  createAudio(filename: string): Promise<void>;
  createVideo(filename: string): Promise<void>;
}

export const InspirationRepository = Symbol('InspirationRepository');
