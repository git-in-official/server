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
    await prisma.userAccessHistory.deleteMany();
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

    it('10일 연속으로 api를 호출하면 매일 그대와 업적을 획득한다', async () => {
      // given
      const { accessToken, name } = await login(app);
      const user = await prisma.user.findFirst({
        where: { name },
      });

      await prisma.achievement.create({
        data: {
          name: '매일 그대와',
          description: '10일 연속 접속한 경우',
          icon: 'https://icon.com',
        },
      });

      await prisma.userAccessHistory.createMany({
        data: Array.from({ length: 9 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - (i + 1)); // 현재일로부터 (i+1)일 전의 날짜를 설정
          return {
            userId: user!.id,
            date: date,
          };
        }),
      });

      // when
      await request(app.getHttpServer())
        .get('/emotions')
        .set('Authorization', `Bearer ${accessToken}`);

      // then
      const achievements = await prisma.achievementAcquisition.findMany({
        where: { userId: user!.id },
        select: {
          userId: true,
          achievement: true,
        },
      });
      expect(achievements.length).toBe(1);
      expect(achievements[0].achievement.name).toBe('매일 그대와');
    });

    it('10일 연속을 채우지 못하면 매일 그대와 업적을 획득하지 못한다', async () => {
      // given
      const { accessToken, name } = await login(app);
      const user = await prisma.user.findFirst({
        where: { name },
      });

      await prisma.achievement.create({
        data: {
          name: '매일 그대와',
          description: '10일 연속 접속한 경우',
          icon: 'https://icon.com',
        },
      });

      await prisma.userAccessHistory.createMany({
        data: Array.from({ length: 5 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - (i + 1)); // 현재일로부터 (i+1)일 전의 날짜를 설정
          return {
            userId: user!.id,
            date: date,
          };
        }),
      });

      // when
      await request(app.getHttpServer())
        .get('/emotions')
        .set('Authorization', `Bearer ${accessToken}`);

      // then
      const achievements = await prisma.achievementAcquisition.findMany({
        where: { userId: user!.id },
        select: {
          userId: true,
          achievement: true,
        },
      });
      expect(achievements.length).toBe(0);
    });

    it('두 번 요청해도 에러가 나지 않는다', async () => {
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

      // when
      const response2 = await request(app.getHttpServer())
        .get('/emotions')
        .set('Authorization', `Bearer ${accessToken}`);

      // then
      expect(response2.status).toBe(200);
      expect(response2.body).toEqual(emotions);
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
