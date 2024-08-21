export interface InspirationRepository {
  findAllTitle(): Promise<{ title: string }[]>;
}

export const InspirationRepository = Symbol('InspirationRepository');
