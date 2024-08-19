import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { describe } from 'node:test';
import { AuthService } from '../../src/auth/auth.service';
import { AppModule } from '../../src/app.module';
import { SignupDto } from '../../src/auth/dto/request';
import { JwtDto } from '../../src/auth/dto/response';
import { PrismaService } from '../../src/prisma/prisma.service';

describe('Poem (e2e)', () => {
  let app: INestApplication;
  let authService: AuthService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    prisma = moduleFixture.get<PrismaService>(PrismaService);
    app = moduleFixture.createNestApplication();
    await app.init();

    authService = moduleFixture.get<AuthService>(AuthService);
    jest.spyOn(authService, 'getGoogleProfile').mockResolvedValue({
      id: 'test-id',
      email: 'test@test.com',
      picture: 'https://picture.com',
      verified_email: true,
    });
  });

  beforeEach(async () => {
    await prisma.scrap.deleteMany();
    await prisma.poem.deleteMany();
    await prisma.user.deleteMany();
  });

  describe('/:id/scrap (POST)', async () => {
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
      expect(unScrapStatus);
      expect(scrap).toBeFalsy();
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
