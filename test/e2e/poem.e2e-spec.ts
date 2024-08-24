import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { describe } from 'node:test';
import { AuthService } from 'src/auth/auth.service';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { LlmService } from 'src/poem/llm.service';
import { login } from './helpers/login';
import * as fs from 'fs';
import * as path from 'path';
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';

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
    await prisma.inspiration.deleteMany();
    await prisma.user.deleteMany();
  });

  describe('POST /poems/:id/scrap - 시 스크랩', async () => {
    it('시 스크랩', async () => {
      // given
      const { accessToken, name } = await login(app);
      const user = await prisma.user.findFirst({
        where: { name },
      });

      const titleInspiration = await prisma.inspiration.create({
        data: {
          type: 'TITLE',
          displayName: 'test-title',
        },
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
          inspirationId: titleInspiration.id,
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

      const titleInspiration = await prisma.inspiration.create({
        data: {
          type: 'TITLE',
          displayName: 'test-title',
        },
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
          inspirationId: titleInspiration.id,
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

  describe('GET /poems/can-write - 시를 쓸 수 있는지 확인', () => {
    it('이미 시를 두 번 썼을 때 423 에러를 반환한다', async () => {
      // given
      const { accessToken, name } = await login(app);
      const user = await prisma.user.findFirst({
        where: { name },
      });
      const titleInspiration = await prisma.inspiration.create({
        data: {
          type: 'TITLE',
          displayName: 'test-title',
        },
      });

      await prisma.poem.createMany({
        data: [
          {
            title: 'test-poem1',
            content: 'test-content1',
            textAlign: 'test-align1',
            textSize: 16,
            textFont: 'test-font1',
            themes: [],
            interactions: [],
            isRecorded: false,
            status: 'test-status1',
            inspirationId: titleInspiration.id,
            authorId: user!.id,
          },
          {
            title: 'test-poem2',
            content: 'test-content2',
            textAlign: 'test-align2',
            textSize: 16,
            textFont: 'test-font2',
            themes: [],
            interactions: [],
            isRecorded: false,
            status: 'test-status2',
            inspirationId: titleInspiration.id,
            authorId: user!.id,
          },
        ],
      });

      // when
      const { status } = await request(app.getHttpServer())
        .get('/poems/can-write')
        .set('Authorization', `Bearer ${accessToken}`);

      // then
      expect(status).toEqual(423);
    });

    it('아직 시를 쓰지 않았거나 한 번만 썼을 때 200을 반환한다', async () => {
      // given
      const { accessToken, name } = await login(app);
      const user = await prisma.user.findFirst({
        where: { name },
      });
      const titleInspiration = await prisma.inspiration.create({
        data: {
          type: 'TITLE',
          displayName: 'test-title',
        },
      });
      await prisma.poem.create({
        data: {
          title: 'test-poem1',
          content: 'test-content1',
          textAlign: 'test-align1',
          textSize: 16,
          textFont: 'test-font1',
          themes: [],
          interactions: [],
          isRecorded: false,
          status: 'test-status1',
          inspirationId: titleInspiration.id,
          authorId: user!.id,
        },
      });

      // when
      const { status } = await request(app.getHttpServer())
        .get('/poems/can-write')
        .set('Authorization', `Bearer ${accessToken}`);

      // then
      expect(status).toEqual(200);
    });
  });

  describe('POST /poems - 시 탈고', async () => {
    it('시를 탈고하면 201 응답과 함께 newPoemDto를 반환한다', async () => {
      // given
      const { accessToken, name } = await login(app);
      const user = await prisma.user.findFirst({
        where: { name },
      });
      const titleInspiration = await prisma.inspiration.create({
        data: {
          type: 'TITLE',
          displayName: 'test-title',
        },
      });

      const createPoemDto = {
        title: 'test-poem',
        content: 'test-content',
        textAlign: 'test-align',
        textSize: 16,
        textFont: 'test-font',
        themes: [],
        interactions: [],
        isRecorded: false,
        inspirationId: titleInspiration.id,
      };

      // when
      const { status, body } = await request(app.getHttpServer())
        .post('/poems')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(createPoemDto);

      // then
      expect(status).toEqual(201);
      expect(body).toEqual({
        id: expect.any(String),
        title: 'test-poem',
        content: 'test-content',
        textAlign: 'test-align',
        textSize: 16,
        textFont: 'test-font',
        themes: [],
        interactions: [],
        isRecorded: false,
        status: '교정중',
        createdAt: expect.any(String),
        authorId: user!.id,
        inspirationId: titleInspiration.id,
      });
    });

    it('녹음 파일이 있는 경우, 녹음 파일의 URL도 함께 반환한다', async () => {
      // given
      const { accessToken, name } = await login(app);
      const user = await prisma.user.findFirst({
        where: { name },
      });
      const titleInspiration = await prisma.inspiration.create({
        data: {
          type: 'TITLE',
          displayName: 'test-title',
        },
      });
      const filePath = path.join(__dirname, 'test.mp3');
      fs.writeFileSync(filePath, 'test-audio');
      const createPoemDto = {
        title: 'test-poem',
        content: 'test-content',
        textAlign: 'test-align',
        textSize: 16,
        textFont: 'test-font',
        themes: ['가족', '사랑'],
        interactions: ['위로', '감성적'],
        isRecorded: true,
        inspirationId: titleInspiration.id,
      };

      // when
      const { status, body } = await request(app.getHttpServer())
        .post('/poems')
        .set('Authorization', `Bearer ${accessToken}`)
        .attach('audioFile', filePath)
        .field('title', createPoemDto.title)
        .field('content', createPoemDto.content)
        .field('textAlign', createPoemDto.textAlign)
        .field('textSize', createPoemDto.textSize)
        .field('textFont', createPoemDto.textFont)
        .field('themes', createPoemDto.themes)
        .field('interactions', createPoemDto.interactions)
        .field('isRecorded', createPoemDto.isRecorded)
        .field('inspirationId', createPoemDto.inspirationId);

      // then
      expect(status).toEqual(201);
      expect(body).toEqual({
        id: expect.any(String),
        title: 'test-poem',
        content: 'test-content',
        textAlign: 'test-align',
        textSize: 16,
        textFont: 'test-font',
        themes: ['가족', '사랑'],
        interactions: ['위로', '감성적'],
        isRecorded: true,
        status: '교정중',
        createdAt: expect.any(String),
        authorId: user!.id,
        inspirationId: titleInspiration.id,
        audioUrl: expect.any(String),
      });
      expect(body.audioUrl).toEqual(
        `${process.env.AWS_CLOUDFRONT_URL}/poems/audios/${body.id}`,
      );

      // cleanup
      fs.unlinkSync(filePath);
      const s3Client = new S3Client();
      await s3Client.send(
        new DeleteObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: `poems/audios/${body.id}`,
        }),
      );
    });
  });

  describe('GET /poems?emotion&index - 감정별 시 목록 조회', () => {
    it('감정이 없을 때도 시를 3개씩 받을 수 있고, 상태가 출판 인 시만 반환한다', async () => {
      // given
      const { accessToken, name } = await login(app);
      const user = await prisma.user.findFirst({
        where: { name },
      });
      const titleInspiration = await prisma.inspiration.create({
        data: {
          type: 'TITLE',
          displayName: 'test-title',
        },
      });

      await prisma.poem.createMany({
        data: [
          {
            title: 'test-poem1',
            content: 'test-content1',
            textAlign: 'test-align1',
            textSize: 16,
            textFont: 'test-font1',
            themes: [],
            interactions: [],
            isRecorded: false,
            status: '출판',
            inspirationId: titleInspiration.id,
            authorId: user!.id,
          },
          {
            title: 'test-poem2',
            content: 'test-content2',
            textAlign: 'test-align2',
            textSize: 16,
            textFont: 'test-font2',
            themes: [],
            interactions: [],
            isRecorded: false,
            status: '출판',
            inspirationId: titleInspiration.id,
            authorId: user!.id,
          },
          {
            title: 'test-poem3',
            content: 'test-content3',
            textAlign: 'test-align3',
            textSize: 16,
            textFont: 'test-font3',
            themes: [],
            interactions: [],
            isRecorded: false,
            status: '출판',
            inspirationId: titleInspiration.id,
            authorId: user!.id,
          },
          {
            title: 'test-poem4',
            content: 'test-content4',
            textAlign: 'test-align4',
            textSize: 16,
            textFont: 'test-font4',
            themes: [],
            interactions: [],
            isRecorded: false,
            status: '교정중',
            inspirationId: titleInspiration.id,
            authorId: user!.id,
          },
        ],
      });

      // when
      const { status, body } = await request(app.getHttpServer())
        .get('/poems')
        .query({ index: 0 })
        .set('Authorization', `Bearer ${accessToken}`);

      // then
      expect(status).toEqual(200);
      expect(body).toHaveLength(3);
      expect(body[0].isScrapped).toBeFalsy();
    });

    it('스크랩한 시인 경우 isScrapped가 true로 반환된다', async () => {
      // given
      const { accessToken, name } = await login(app);
      const user = await prisma.user.findFirst({
        where: { name },
      });
      const titleInspiration = await prisma.inspiration.create({
        data: {
          type: 'TITLE',
          displayName: 'test-title',
        },
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
          status: '출판',
          inspirationId: titleInspiration.id,
          authorId: user!.id,
        },
      });

      await prisma.scrap.create({
        data: {
          poemId: poem.id,
          userId: user!.id,
        },
      });

      // when
      const { status, body } = await request(app.getHttpServer())
        .get('/poems')
        .query({ index: 0 })
        .set('Authorization', `Bearer ${accessToken}`);

      // then
      expect(status).toEqual(200);
      expect(body).toHaveLength(1);
      expect(body[0].isScrapped).toBeTruthy();
    });
  });
});
