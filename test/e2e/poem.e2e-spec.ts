import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { describe } from 'node:test';
import { AuthService } from '../../src/auth/auth.service';
import { AppModule } from '../../src/app.module';
import { SignupDto } from '../../src/auth/dto/request';
import { JwtDto } from '../../src/auth/dto/response';
import { PrismaService } from '../../src/prisma/prisma.service';
import { themes, interactions } from 'src/constants/tags';

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

      const analyzePoemDto = {
        title: '니가 어떤 딸인데 그러니',
        content:
          '너 훌쩍이는 소리가\n네 어머니 귀에는 천둥소리라 하더라.\n그녀를 닮은 얼굴로 서럽게 울지마라.',
      };

      // when
      const response = await request(app.getHttpServer())
        .post('/poems/analyze')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(analyzePoemDto);

      // then
      expect(response.status).toEqual(200);

      // 테마는 테마리스트들로 이루어져 있다.
      expect(response.body.themes).toEqual(
        expect.arrayContaining(
          response.body.themes.map(() =>
            expect.stringMatching(new RegExp(`^(${themes.join('|')})$`)),
          ),
        ),
      );

      // 상호작용은 상호작용리스트들로 이루어져 있다.
      expect(response.body.interactions).toEqual(
        expect.arrayContaining(
          response.body.interactions.map(() =>
            expect.stringMatching(new RegExp(`^(${interactions.join('|')})$`)),
          ),
        ),
      );
    }, 10000);
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
