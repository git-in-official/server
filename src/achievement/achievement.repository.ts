export interface AchievementRepository {
  findAll(): Promise<Achievement[]>;
  findAllByUserId(userId: string): Promise<Achievement[]>;
  acquire(userId: string, achievementName: string): Promise<void>;
}

type Achievement = {
  id: string;
  name: string;
  icon: string;
  description: string;
};

export const AchievementRepository = Symbol('AchievementRepository');
