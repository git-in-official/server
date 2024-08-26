export interface EmotionRepository {
  createSelection(userId: string, emotion: string): Promise<void>;
  CountSelection(userId: string): Promise<number>;
}

export const EmotionRepository = Symbol('EmotionRepository');
