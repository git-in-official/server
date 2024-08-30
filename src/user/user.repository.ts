export interface UserRepository {
  findOneByProvider(
    provider: 'GOOGLE' | 'APPLE',
    providerId: string,
  ): Promise<{
    id: string;
    provider: 'GOOGLE' | 'APPLE';
    providerId: string;
    name: string;
  } | null>;

  findOneDetailById(id: string): Promise<User | null>;
  findOneById(id: string): Promise<{ id: string } | null>;

  create({
    provider,
    providerId,
    name,
  }: {
    provider: 'GOOGLE' | 'APPLE';
    providerId: string;
    name: string;
  }): Promise<{
    id: string;
    provider: 'GOOGLE' | 'APPLE';
    providerId: string;
    name: string;
  }>;
  update(userId: string, data: UpdateUserData): Promise<void>;
  updateMainAchievement(userId: string, achievementId: string): Promise<void>;

  createAccessHistory(userId: string): Promise<void>;
  countAccessHistoryRecentTenDays(userId: string, date?: Date): Promise<number>;
}

type Achievement = {
  id: string;
  name: string;
  icon: string;
  description: string;
};

type User = {
  id: string;
  name: string;
  ink: number;
  introduction?: string | null;
  mainAchievement?: Achievement | null;
  achievements: Achievement[];
};

export type UpdateUserData = {
  name: string;
  introduction?: string | null;
};

export const UserRepository = Symbol('UserRepository');
