import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { login } from './helpers';
import { AuthService } from 'src/auth/auth.service';

describe('Admin (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let authService: AuthService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    prisma = moduleFixture.get<PrismaService>(PrismaService);
    authService = moduleFixture.get<AuthService>(AuthService);

    app = moduleFixture.createNestApplication();
    await app.init();

    jest.spyOn(authService, 'getGoogleProfile').mockResolvedValue({
      id: 'test-id',
      email: 'test@test.com',
      picture: 'https://picture.com',
      verified_email: true,
    });
  });

  afterEach(async () => {
    await prisma.poem.deleteMany();
    await prisma.inspiration.deleteMany();
    await prisma.achievementAcquisition.deleteMany();
    await prisma.achievement.deleteMany();
    await prisma.user.deleteMany();
  });

  describe('POST /admin/inspirations - 글감 업로드', () => {
    it('제목 글감을 생성한다', async () => {
      // given
      const testData = {
        type: 'TITLE',
        text: 'test-title',
      };

      // when
      const { status } = await request(app.getHttpServer())
        .post('/admin/inspirations')
        .send(testData);

      // then
      expect(status).toBe(201);
      const titleInspiration = await prisma.inspiration.findFirst({
        where: { displayName: testData.text },
      });
      expect(titleInspiration?.displayName).toBe(testData.text);
    });

    it('단어 글감을 생성한다', async () => {
      // given
      const testData = {
        type: 'WORD',
        text: 'test-word',
      };

      // when
      const { status } = await request(app.getHttpServer())
        .post('/admin/inspirations')
        .send(testData);

      // then
      expect(status).toBe(201);
      const wordInspiration = await prisma.inspiration.findFirst({
        where: { displayName: testData.text },
      });
      expect(wordInspiration?.displayName).toBe(testData.text);
    });

    it('오디오 글감을 생성한다', async () => {
      // given
      const filePath = path.join(__dirname, 'test.mp3');
      fs.writeFileSync(filePath, 'test-audio');

      const testData = {
        type: 'AUDIO',
      };

      // when
      const { status } = await request(app.getHttpServer())
        .post('/admin/inspirations')
        .attach('file', filePath)
        .field('type', testData.type);

      // then
      expect(status).toBe(201);
      const audioInspiration = await prisma.inspiration.findFirst({
        where: { displayName: 'test.mp3' },
      });
      expect(audioInspiration?.displayName).toBe('test.mp3');

      // clean up
      fs.unlinkSync(filePath);

      const s3Client = new S3Client({});
      await s3Client.send(
        new DeleteObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: 'inspirations/audios/test.mp3',
        }),
      );
    });

    it('비디오 글감을 생성한다', async () => {
      // given
      const filePath = path.join(__dirname, 'test.mp4');
      fs.writeFileSync(filePath, 'test-video');

      const testData = {
        type: 'VIDEO',
      };

      // when
      const { status } = await request(app.getHttpServer())
        .post('/admin/inspirations')
        .attach('file', filePath)
        .field('type', testData.type);

      // then
      expect(status).toBe(201);
      const videoInspiration = await prisma.inspiration.findFirst({
        where: { displayName: 'test.mp4' },
      });
      expect(videoInspiration?.displayName).toBe('test.mp4');

      // clean up
      fs.unlinkSync(filePath);

      const s3Client = new S3Client({});
      await s3Client.send(
        new DeleteObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: 'inspirations/videos/test.mp4',
        }),
      );
    });
  });

  describe('GET /admin/poems/proofreading - 교정중인 시 목록 조회', () => {
    it('교정중인 시 목록을 조회한다', async () => {
      // given
      const { accessToken, name } = await login(app);
      const user = await prisma.user.findFirst({
        where: { name },
      });
      const inspiration = await prisma.inspiration.create({
        data: {
          type: 'TITLE',
          displayName: 'test-title',
        },
      });
      const testData = [
        {
          title: 'test-title',
          content: 'test-content',
          themes: ['test-theme'],
          interactions: ['test-interaction'],
          textAlign: 'center',
          textSize: 16,
          textFont: 'test-font',
          isRecorded: false,
          inspirationId: inspiration.id,
          status: '교정중',
          authorId: user!.id,
        },
        {
          title: 'test-title2',
          content: 'test-content2',
          themes: ['test-theme2'],
          interactions: ['test-interaction2'],
          textAlign: 'center',
          textSize: 16,
          textFont: 'test-font',
          isRecorded: false,
          inspirationId: inspiration.id,
          status: '교정중',
          authorId: user!.id,
        },
      ];
      await prisma.poem.createMany({
        data: testData,
      });

      // when
      const { status, body } = await request(app.getHttpServer()).get(
        '/admin/poems/proofreading',
      );

      // then
      expect(status).toBe(200);
      expect(body).toHaveLength(2);
      expect(body[1].title).toBeDefined();
      expect(body[1].authorName).toBeDefined();
      expect(body[1].themes).toBeDefined();
    });
  });

  describe('PATCH /admin/poems/proofreading/:id/publish - 출판', () => {
    it('시를 출판하면 ink가 10 추가된다.', async () => {
      // given
      const { accessToken, name } = await login(app);
      const user = await prisma.user.findFirst({
        where: { name },
      });
      const inspiration = await prisma.inspiration.create({
        data: {
          type: 'TITLE',
          displayName: 'test-title',
        },
      });
      await prisma.achievement.create({
        data: {
          name: '첫 발자국',
          description: '첫 시를 출판했습니다.',
          icon: 'test-icon',
        },
      });
      const poem = await prisma.poem.create({
        data: {
          title: 'test-title',
          content: 'test-content',
          themes: ['test-theme'],
          interactions: ['test-interaction'],
          textAlign: 'center',
          textSize: 16,
          textFont: 'test-font',
          isRecorded: false,
          inspirationId: inspiration.id,
          status: '교정중',
          authorId: user!.id,
        },
      });

      // when
      const { status } = await request(app.getHttpServer()).patch(
        `/admin/poems/proofreading/${poem.id}/publish`,
      );

      // then
      expect(status).toBe(200);
      const publishedPoem = await prisma.poem.findUnique({
        where: { id: poem.id },
      });
      expect(publishedPoem?.status).toBe('출판');
      const updatedUser = await prisma.user.findFirst({
        where: { name },
      });
      expect(updatedUser?.ink).toBe(10);
    });

    it('시를 출판하면 해당 유저는 첫 발자국 업적을 획득한다', async () => {
      // given
      const { accessToken, name } = await login(app);
      const user = await prisma.user.findFirst({
        where: { name },
      });
      await prisma.achievement.create({
        data: {
          name: '첫 발자국',
          description: '첫 시를 출판했습니다.',
          icon: 'test-icon',
        },
      });
      const inspiration = await prisma.inspiration.create({
        data: {
          type: 'TITLE',
          displayName: 'test-title',
        },
      });
      const poem = await prisma.poem.create({
        data: {
          title: 'test-title',
          content: 'test-content',
          themes: ['test-theme'],
          interactions: ['test-interaction'],
          textAlign: 'center',
          textSize: 16,
          textFont: 'test-font',
          isRecorded: false,
          inspirationId: inspiration.id,
          status: '교정중',
          authorId: user!.id,
        },
      });

      // when
      const { status } = await request(app.getHttpServer()).patch(
        `/admin/poems/proofreading/${poem.id}/publish`,
      );

      // then
      expect(status).toBe(200);
      const achievementAcquisitions =
        await prisma.achievementAcquisition.findMany({
          where: { userId: user!.id },
          select: {
            userId: true,
            achievement: true,
          },
        });
      expect(achievementAcquisitions).toHaveLength(1);
      expect(achievementAcquisitions[0].achievement.name).toBe('첫 발자국');
    });
  });

  describe('GET /admin/inspirations/titles - 제목 글감 전체 리스트 조회', () => {
    it('제목 글감 전체 리스트를 반환한다', async () => {
      // given
      await prisma.inspiration.createMany({
        data: [
          {
            type: 'TITLE',
            displayName: 'test-title',
          },
          {
            type: 'TITLE',
            displayName: 'test-title2',
          },
        ],
      });

      // when
      const { status, body } = await request(app.getHttpServer()).get(
        '/admin/inspirations/titles',
      );

      // then
      expect(status).toBe(200);
      expect(body).toHaveLength(2);
      expect(body[1].title).toBeDefined();
    });
  });

  describe('GET /admin/inspirations/words - 단어 글감 전체 리스트 조회', () => {
    it('단어 글감 전체 리스트를 반환한다', async () => {
      // given
      await prisma.inspiration.createMany({
        data: [
          {
            type: 'WORD',
            displayName: 'test-word',
          },
          {
            type: 'WORD',
            displayName: 'test-word2',
          },
        ],
      });

      // when
      const { status, body } = await request(app.getHttpServer()).get(
        '/admin/inspirations/words',
      );

      // then
      expect(status).toBe(200);
      expect(body).toHaveLength(2);
      expect(body[1].word).toBeDefined();
    });
  });

  describe('GET /admin/inspirations/audios - 오디오 글감 전체 리스트 조회', () => {
    it('오디오 글감 전체 리스트를 반환한다', async () => {
      // given
      await prisma.inspiration.createMany({
        data: [
          {
            type: 'AUDIO',
            displayName: 'test.mp3',
          },
          {
            type: 'AUDIO',
            displayName: 'test.mp32',
          },
        ],
      });

      // when
      const { status, body } = await request(app.getHttpServer()).get(
        '/admin/inspirations/audios',
      );

      // then
      expect(status).toBe(200);
      expect(body).toHaveLength(2);
      expect(body[1].filename).toBeDefined();
      expect(body[1].audioUrl).toBeDefined();
    });
  });

  describe('GET /admin/inspirations/videos - 비디오 글감 전체 리스트 조회', () => {
    it('비디오 글감 전체 리스트를 반환한다', async () => {
      // given
      await prisma.inspiration.createMany({
        data: [
          {
            type: 'VIDEO',
            displayName: 'test.mp4',
          },
          {
            type: 'VIDEO',
            displayName: 'test2.mp4',
          },
        ],
      });

      // when
      const { status, body } = await request(app.getHttpServer()).get(
        '/admin/inspirations/videos',
      );

      // then
      expect(status).toBe(200);
      expect(body).toHaveLength(2);
      expect(body[1].filename).toBeDefined();
      expect(body[1].videoUrl).toBeDefined();
    });
  });
});
