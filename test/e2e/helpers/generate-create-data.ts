export const createAchievementData = (
  name: string,
  icon: string = 'https://icon.com',
  description: string = '획득 조건',
) => {
  return {
    name,
    icon,
    description,
  };
};

export const createUserData = (
  name: string,
  providerId: string,
  provider: 'GOOGLE' | 'APPLE' = 'GOOGLE',
) => {
  return {
    name,
    providerId,
    provider,
  };
};

export const createPoemData = (
  authorId: string,
  inspirationId: string,
  status: string = 'test-status',
  title: string = 'test-poem',
  content: string = 'test-content',
  textAlign: string = 'test-align',
  textSize: number = 16,
  textFont: string = 'test-font',
  themes: string[] = [],
  interactions: string[] = [],
  isRecorded: boolean = false,
) => {
  return {
    title,
    content,
    textAlign,
    textSize,
    textFont,
    themes,
    interactions,
    isRecorded,
    status,
    inspirationId,
    authorId,
  };
};
