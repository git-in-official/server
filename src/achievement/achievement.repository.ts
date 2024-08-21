export interface AchievementRepository {
  findAll(): Promise<Achievement[]>;
  findAllByUserId(userId: string): Promise<Achievement[]>;
}

type AchievementName = 'SCRAPKING' | 'SCRAPQUEEN';

type Achievement = {
  id: string;
  name: AchievementName;
  icon: string;
  description: string;
};

export const AchievementRepository = Symbol('AchievementRepository');
