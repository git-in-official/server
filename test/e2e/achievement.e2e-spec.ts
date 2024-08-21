import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { describe } from 'node:test';
import { AuthService } from 'src/auth/auth.service';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { AchievementsDto } from 'src/achievement/dto/response';
import { login } from './helpers';

describe('Achievement (e2e)', () => {
  let app: INestApplication;
  let authService: AuthService;
  let prisma: PrismaService;

  beforeAll(async () => {
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
    await prisma.achievement.deleteMany();
    await prisma.user.deleteMany();
  });

  describe('GET /achievements - 모든 업적 조회', async () => {
    it('모든 업적 조회', async () => {
      // given
      const { accessToken } = await login(app);

      await prisma.achievement.create({
        data: {
          icon: 'https://icon1.com',
          name: 'SCRAPKING',
        },
      });
      await prisma.achievement.create({
        data: {
          icon: 'https://icon2.com',
          name: 'SCRAPQUEEN',
        },
      });

      // when
      const response = await request(app.getHttpServer())
        .get('/achievements')
        .set('Authorization', `Bearer ${accessToken}`);
      const { status } = response;
      const body: AchievementsDto[] = response.body;

      // then
      expect(status).toEqual(200);
      expect(body.length).toEqual(2);
      body.forEach((achievement) => {
        expect(achievement.id).toBeDefined();
        expect(achievement.name).toBeDefined();
        expect(achievement.icon).toBeDefined();
      });
    });
  });
});
