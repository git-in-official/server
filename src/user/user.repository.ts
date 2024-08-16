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

export const UserRepository = Symbol('UserRepository');
