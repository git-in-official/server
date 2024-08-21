import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { describe } from 'node:test';
import { AuthService } from '../../src/auth/auth.service';
import { AppModule } from '../../src/app.module';
import { SignupDto } from '../../src/auth/dto/request';
import { JwtDto } from '../../src/auth/dto/response';
import { PrismaService } from '../../src/prisma/prisma.service';
import { LlmService } from 'src/poem/llm.service';

describe('Poem (e2e)', () => {
  let app: INestApplication;
  let authService: AuthService;
  let prisma: PrismaService;
  let llmService: LlmService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    prisma = moduleFixture.get<PrismaService>(PrismaService);
    app = moduleFixture.createNestApplication();
    await app.init();

    authService = moduleFixture.get<AuthService>(AuthService);
    llmService = moduleFixture.get<LlmService>(LlmService);
    jest.spyOn(authService, 'getGoogleProfile').mockResolvedValue({
      id: 'test-id',
      email: 'test@test.com',
      picture: 'https://picture.com',
      verified_email: true,
    });
  });

  afterEach(async () => {
    await prisma.scrap.deleteMany();
    await prisma.poem.deleteMany();
    await prisma.user.deleteMany();
  });

  describe('POST /poems/:id/scrap - 시 스크랩', async () => {
    it('시 스크랩', async () => {
      // given
      const { accessToken, name } = await login(app);
      const user = await prisma.user.findFirst({
        where: { name },
      });

      const poem = await prisma.poem.create({
        data: {
          title: 'test-poem',
          content: 'test-content',
          textAlign: 'test-align',
          textSize: 16,
          textFont: 'test-font',
          themes: [],
          interactions: [],
          isRecorded: false,
          status: 'test-status',
          authorId: user!.id,
        },
      });

      // when
      const response = await request(app.getHttpServer())
        .post(`/poems/${poem.id}/scrap`)
        .set('Authorization', `Bearer ${accessToken}`);
      const { status } = response;

      const scrap = await prisma.scrap.findFirst({
        where: {
          poemId: poem.id,
          userId: user!.id,
        },
      });

      // then
      expect(status).toEqual(201);
      expect(scrap).toBeTruthy();
    });

    it('시 스크랩 취소', async () => {
      // given
      const { accessToken, name } = await login(app);
      const user = await prisma.user.findFirst({
        where: { name },
      });

      const poem = await prisma.poem.create({
        data: {
          title: 'test-poem',
          content: 'test-content',
          textAlign: 'test-align',
          textSize: 16,
          textFont: 'test-font',
          themes: [],
          interactions: [],
          isRecorded: false,
          status: 'test-status',
          authorId: user!.id,
        },
      });

      // when
      const scrapResponse = await request(app.getHttpServer())
        .post(`/poems/${poem.id}/scrap`)
        .set('Authorization', `Bearer ${accessToken}`);
      const unScrapResponse = await request(app.getHttpServer())
        .post(`/poems/${poem.id}/scrap`)
        .set('Authorization', `Bearer ${accessToken}`);
      const { status: scrapStatus } = scrapResponse;
      const { status: unScrapStatus } = unScrapResponse;

      const scrap = await prisma.scrap.findFirst({
        where: {
          poemId: poem.id,
          userId: user!.id,
        },
      });

      // then
      expect(scrapStatus).toEqual(201);
      expect(unScrapStatus).toEqual(201);
      expect(scrap).toBeFalsy();
    });
  });

  describe('POST /poems/analyze - 시 태그 분석', async () => {
    it('시의 제목과 내용을 분석하여 테마와 상호작용 태그를 반환한다.', async () => {
      // given
      const { accessToken, name } = await login(app);
      const user = await prisma.user.findFirst({
        where: { name },
      });
      jest.spyOn(llmService, 'analyzePoem').mockResolvedValue({
        themes: ['테스트테마1', '테스트테마2'],
        interactions: ['테스트상호작용1', '테스트상호작용2'],
      });

      const analyzePoemDto = {
        title: '니가 어떤 딸인데 그러니',
        content:
          '너 훌쩍이는 소리가\n네 어머니 귀에는 천둥소리라 하더라.\n그녀를 닮은 얼굴로 서럽게 울지마라.',
      };

      // when
      const { status, body } = await request(app.getHttpServer())
        .post('/poems/analyze')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(analyzePoemDto);

      // then
      expect(status).toEqual(200);
      expect(body).toEqual({
        themes: ['테스트테마1', '테스트테마2'],
        interactions: ['테스트상호작용1', '테스트상호작용2'],
      });
    });
  });

  describe('PATCH /poems/tag - 시 태그 수정', async () => {
    it('서비스에 정의된 테마와 상호작용이 아닌 태그를 입력하면 400 에러를 반환한다.', async () => {
      // given
      const { accessToken, name } = await login(app);
      const user = await prisma.user.findFirst({
        where: { name },
      });

      const updateTagDto = {
        title: 'test-title',
        beforeThemes: ['test-theme1', 'test-theme2'],
        beforeInteractions: ['test-interaction1', 'test-interaction2'],
        afterThemes: ['test-theme1', 'test-theme2'],
        afterInteractions: ['test-interaction1', 'test-interaction2'],
        content: 'test-content',
      };

      // when
      const { status } = await request(app.getHttpServer())
        .patch('/poems/tag')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updateTagDto);

      // then
      expect(status).toEqual(400);
    });

    it('시의 태그를 수정하면 시의 내용을 수정해서 반환한다.', async () => {
      // given
      const { accessToken, name } = await login(app);
      const user = await prisma.user.findFirst({
        where: { name },
      });
      jest.spyOn(llmService, 'updateTag').mockResolvedValue({
        title: 'mocked-title',
        content: 'mocked-content',
      });

      const updateTagDto = {
        title: '니가 어떤 딸인데 그러니',
        beforeThemes: ['가족', '사랑'],
        beforeInteractions: ['위로', '감성적'],
        afterThemes: ['가족', '그리움'],
        afterInteractions: ['위로', '감성적'],
        content:
          '너 훌쩍이는 소리가\n네 어머니 귀에는 천둥소리라 하더라.\n그녀를 닮은 얼굴로 서럽게 울지마라.',
      };

      // when
      const { status, body } = await request(app.getHttpServer())
        .patch('/poems/tag')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updateTagDto);

      // then
      expect(status).toEqual(200);
      expect(body).toEqual({
        title: 'mocked-title',
        content: 'mocked-content',
      });
    });
  });
});

const login = async (app: INestApplication) => {
  const dto: SignupDto = {
    name: 'test',
    provider: 'GOOGLE',
    providerAccessToken: 'test-oauth-token',
  };

  const response = await request(app.getHttpServer())
    .post('/auth/signup')
    .send(dto);
  const body: JwtDto = response.body;

  return {
    accessToken: body.accessToken,
    name: dto.name,
  };
};
