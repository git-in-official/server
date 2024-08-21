export interface AchievementRepository {
  findAll(): Promise<Achievement[]>;
}

export type AchievementName = 'SCRAPKING' | 'SCRAPQUEEN';

export type Achievement = {
  id: string;
  name: AchievementName;
  icon: string;
};

export const AchievementRepository = Symbol('AchievementRepository');
