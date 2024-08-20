import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';

describe('Tag (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('GET /tags - 태그 목록 조회', () => {
    it('테마와 상호작용의 전체 목록을 반환한다', async () => {
      // when
      const response = await request(app.getHttpServer()).get('/tags');

      // then
      const expectedThemes = [
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
      ];
      const expectedInteractions = [
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
      ];
      expect(response.status).toBe(200);
      expect(response.body.themes).toEqual(expectedThemes);
      expect(response.body.interactions).toEqual(expectedInteractions);
    });
  });
});
