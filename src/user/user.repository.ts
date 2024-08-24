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

export const UserRepository = Symbol('UserRepository');
