import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { AuthService } from 'src/auth/auth.service';
import { login } from './helpers';
import { PrismaService } from 'src/prisma/prisma.service';
import { emotions } from 'src/constants/emotions';

describe('EmotionController (e2e)', () => {
  let app: INestApplication;
  let authService: AuthService;
  let prisma: PrismaService;

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
    await prisma.achievementAcquisition.deleteMany();
    await prisma.achievement.deleteMany();
    await prisma.emotionSelection.deleteMany();
    await prisma.user.deleteMany();
  });

  describe('GET /emotions - 감정 리스트 반환', () => {
    it('미리 정의해둔 감정과 description 리스트를 반환한다.', async () => {
      // given
      const { accessToken, name } = await login(app);
      const user = await prisma.user.findFirst({
        where: { name },
      });

      // when
      const response = await request(app.getHttpServer())
        .get('/emotions')
        .set('Authorization', `Bearer ${accessToken}`);

      // then
      expect(response.status).toBe(200);
      expect(response.body).toEqual(emotions);
    });
  });

  describe('POST /emotions/select - 감정 선택', () => {
    it('감정을 선택하면 해당 내역을 저장한다.', async () => {
      // given
      const { accessToken, name } = await login(app);
      const user = await prisma.user.findFirst({
        where: { name },
      });

      // when
      const { status, body } = await request(app.getHttpServer())
        .post('/emotions/select')
        .send({ emotion: '슬픔' })
        .set('Authorization', `Bearer ${accessToken}`);

      // then
      expect(status).toBe(201);
      console.log(status);
    });

    it('모든 감정을 한 번씩 선택하면 업적을 획득한다', async () => {
      // given
      const { accessToken, name } = await login(app);
      const user = await prisma.user.findFirst({
        where: { name },
      });

      await prisma.achievement.create({
        data: {
          name: '들쑥날쑥',
          description: '모든 감정을 한 번씩 선택했습니다.',
          icon: 'https://icon.com',
        },
      });

      // when
      for (const emotion of emotions) {
        await request(app.getHttpServer())
          .post('/emotions/select')
          .send({ emotion: emotion.emotion })
          .set('Authorization', `Bearer ${accessToken}`);
      }
      for (const emotion of emotions) {
        await request(app.getHttpServer())
          .post('/emotions/select')
          .send({ emotion: emotion.emotion })
          .set('Authorization', `Bearer ${accessToken}`);
      }

      // then
      const achievements = await prisma.achievementAcquisition.findMany({
        where: { userId: user!.id },
        select: {
          userId: true,
          achievement: true,
        },
      });
      expect(achievements.length).toBe(1);
      expect(achievements[0].achievement.name).toBe('들쑥날쑥');
    });
  });
});
