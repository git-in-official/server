export const themes = [
  '로맨틱',
  '우정',
  '가족',
  '성장',
  '희망',
  '자연',
  '외로움',
  '상실',
  '죽음',
  '그리움',
  '영적',
  '성공',
  '평화',
  '즐거움',
  '기쁨',
  '갈등',
  '화해',
  '불확실성',
  '추악함',
  '좌절',
  '불의',
  '사랑',
  '연민',
] as const;

export const interactions = [
  '위로',
  '카타르시스',
  '감사',
  '환희',
  '성찰',
  '격려',
  '노스텔지아',
  '자아비판',
  '연대감',
  '감성적',
  '이성적',
  '의문',
  '상상력',
  '축하',
] as const;

export const firstTags = [
  {
    emotion: '슬픔',
    themes: ['외로움', '상실', '연민', '죽음', '그리움', '좌절'],
    interactions: ['노스텔지아', '감성적'],
  },
  {
    emotion: '기쁨',
    themes: ['로맨틱', '성공', '우정', '가족', '즐거움', '기쁨', '화해'],
    interactions: ['감사', '환희', '감성적', '축하'],
  },
  {
    emotion: '두려움',
    themes: ['자연', '외로움', '성장', '갈등', '죽음', '불확실성'],
    interactions: ['자아비판', '의문'],
  },
  {
    emotion: '신뢰',
    themes: ['우정', '평화', '가족', '기쁨', '영적', '화해'],
    interactions: ['격려', '감사', '연대감'],
  },
  {
    emotion: '기대',
    themes: ['로맨틱', '성장', '희망', '영적', '자연', '성공'],
    interactions: ['성찰', '격려', '상상력'],
  },
  {
    emotion: '분노',
    themes: ['갈등', '추악함', '불의', '상실'],
    interactions: ['자아비판', '이성적', '의문'],
  },
] as const;

export const secondTags = [
  {
    emotion: '슬픔',
    themes: ['가족', '희망', '성공', '화해', '사랑'],
    interactions: ['위로', '연대감', '환희'],
  },
  {
    emotion: '기쁨',
    themes: [],
    interactions: ['성찰', '이성적'],
  },
  {
    emotion: '두려움',
    themes: ['희망', '영적', '성장', '평화', '기쁨'],
    interactions: ['연대감', '카타르시스', '상상력'],
  },
  {
    emotion: '신뢰',
    themes: [],
    interactions: ['성찰', '이성적', '의문'],
  },
  {
    emotion: '기대',
    themes: [],
    interactions: ['노스텔지아', '자아비판', '이성적', '축하'],
  },
  {
    emotion: '분노',
    themes: ['자연', '평화', '화해', '즐거움', '기쁨', '사랑'],
    interactions: ['위로', '카타르시스', '감사', '환희', '감성적'],
  },
] as const;
