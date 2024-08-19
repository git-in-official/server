import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { EmotionModule } from 'src/emotion/emotion.module';

describe('EmotionController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [EmotionModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('GET /emotions - 감정 리스트 반환', () => {
    it('미리 정의해둔 감정과 description 리스트를 반환한다.', () => {
      const expectedEmotions = [
        {
          emotion: '슬픔',
          description: ['슬픔', '실패', '이별'],
        },
        {
          emotion: '기쁨',
          description: ['사랑', '성공', '즐거움'],
        },
        {
          emotion: '두려움',
          description: ['불안', '긴장', '불확실성'],
        },
        {
          emotion: '신뢰',
          description: ['의지', '안정감', '친밀감'],
        },
        {
          emotion: '기대',
          description: ['동기부여', '설렘'],
        },
        {
          emotion: '분노',
          description: ['격노', '좌절', '경멸'],
        },
      ];

      return request(app.getHttpServer())
        .get('/emotions')
        .expect(200)
        .expect(expectedEmotions);
    });
  });
});
