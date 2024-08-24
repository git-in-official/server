import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthService } from 'src/auth/auth.service';
import { login } from './helpers/login';

describe('Inspiration (e2e)', () => {
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
    await prisma.inspiration.deleteMany();
    await prisma.user.deleteMany();
  });

  describe('GET /inspirations/title - 제목 글감 받기', () => {
    it('제목 글감을 반환한다', async () => {
      // given
      const { accessToken } = await login(app);

      await prisma.inspiration.create({
        data: {
          type: 'TITLE',
          displayName: 'test-title',
        },
      });

      // when
      const { status, body } = await request(app.getHttpServer())
        .get('/inspirations/title')
        .set('Authorization', `Bearer ${accessToken}`);

      // then
      expect(status).toBe(200);
      expect(body.title).toBe('test-title');
      expect(body.id).toBeDefined();
    });
  });

  it('제목 글감이 없으면 404를 반환한다', async () => {
    // given
    const { accessToken } = await login(app);

    // when
    const { status } = await request(app.getHttpServer())
      .get('/inspirations/title')
      .set('Authorization', `Bearer ${accessToken}`);

    // then
    expect(status).toBe(404);
  });

  describe('GET /inspirations/word - 단어 글감 받기', () => {
    it('단어 글감을 반환한다', async () => {
      // given
      const { accessToken } = await login(app);

      await prisma.inspiration.create({
        data: {
          type: 'WORD',
          displayName: 'test-word',
        },
      });

      // when
      const { status, body } = await request(app.getHttpServer())
        .get('/inspirations/word')
        .set('Authorization', `Bearer ${accessToken}`);

      // then
      expect(status).toBe(200);
      expect(body.word).toBe('test-word');
      expect(body.id).toBeDefined();
    });

    it('단어 글감이 없으면 404를 반환한다', async () => {
      // given
      const { accessToken } = await login(app);

      // when
      const { status } = await request(app.getHttpServer())
        .get('/inspirations/word')
        .set('Authorization', `Bearer ${accessToken}`);

      // then
      expect(status).toBe(404);
    });
  });

  describe('GET /inspirations/audio - 오디오 글감 받기', () => {
    it('오디오 글감을 반환한다', async () => {
      // given
      const { accessToken } = await login(app);

      await prisma.inspiration.create({
        data: {
          type: 'AUDIO',
          displayName: 'test.mp3',
        },
      });

      // when
      const { status, body } = await request(app.getHttpServer())
        .get('/inspirations/audio')
        .set('Authorization', `Bearer ${accessToken}`);

      // then
      const expectedData = {
        filename: 'test.mp3',
        id: expect.any(String),
        audioUrl: expect.stringContaining(process.env.AWS_CLOUDFRONT_URL!),
      };
      expect(status).toBe(200);
      expect(body).toEqual(expectedData);
    });

    it('오디오 글감이 없으면 404를 반환한다', async () => {
      // given
      const { accessToken } = await login(app);

      // when
      const { status } = await request(app.getHttpServer())
        .get('/inspirations/audio')
        .set('Authorization', `Bearer ${accessToken}`);

      // then
      expect(status).toBe(404);
    });

    describe('GET /inspirations/video - 비디오 글감 받기', () => {
      it('비디오 글감을 반환한다', async () => {
        // given
        const { accessToken } = await login(app);

        await prisma.inspiration.create({
          data: {
            type: 'VIDEO',
            displayName: 'test.mp4',
          },
        });

        // when
        const { status, body } = await request(app.getHttpServer())
          .get('/inspirations/video')
          .set('Authorization', `Bearer ${accessToken}`);

        // then
        const expectedData = {
          filename: 'test.mp4',
          id: expect.any(String),
          videoUrl: expect.stringContaining(process.env.AWS_CLOUDFRONT_URL!),
        };
        expect(status).toBe(200);
        expect(body).toEqual(expectedData);
      });

      it('비디오 글감이 없으면 404를 반환한다', async () => {
        // given
        const { accessToken } = await login(app);

        // when
        const { status } = await request(app.getHttpServer())
          .get('/inspirations/video')
          .set('Authorization', `Bearer ${accessToken}`);

        // then
        expect(status).toBe(404);
      });
    });
  });
});
