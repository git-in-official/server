import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { describe } from 'node:test';
import { AuthService } from 'src/auth/auth.service';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { login } from './helpers/login';
import {
  createAchievementData,
  createPoemData,
  createUserData,
} from './helpers';
import { UpdateUserDto } from '../../src/user/dto/request/update-user.dto';

describe('User (e2e)', () => {
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
    await prisma.achievementAcquisition.deleteMany();
    await prisma.achievement.deleteMany();
    await prisma.scrap.deleteMany();
    await prisma.poem.deleteMany();
    await prisma.inspiration.deleteMany();
    await prisma.user.deleteMany();
  });

  describe('GET /user/profile - 프로필 정보 조회', async () => {
    it('프로필 정보 조회', async () => {
      // given
      const { accessToken, name } = await login(app);
      const user = await prisma.user.findFirst({
        where: { name },
      });

      const otherUser1 = await prisma.user.create({
        data: createUserData('other-user1', 'test-id1'),
      });
      const otherUser2 = await prisma.user.create({
        data: createUserData('other-user2', 'test-id2'),
      });

      const achievement1 = await prisma.achievement.create({
        data: createAchievementData('멋진 업적'),
      });
      const achievement2 = await prisma.achievement.create({
        data: createAchievementData('더 멋진 업적'),
      });

      await prisma.achievementAcquisition.create({
        data: {
          userId: user!.id,
          achievementId: achievement1.id,
        },
      });

      await prisma.user.update({
        where: { id: user!.id },
        data: {
          mainAchievementId: achievement1.id,
        },
      });

      const titleInspiration = await prisma.inspiration.create({
        data: {
          type: 'TITLE',
          displayName: 'test-title',
        },
      });

      const poem1 = await prisma.poem.create({
        data: createPoemData(user!.id, titleInspiration.id),
      });
      const poem2 = await prisma.poem.create({
        data: createPoemData(user!.id, titleInspiration.id),
      });

      const scrap1 = await prisma.scrap.create({
        data: {
          userId: otherUser1.id,
          poemId: poem1.id,
        },
      });

      const scrap2 = await prisma.scrap.create({
        data: {
          userId: otherUser1.id,
          poemId: poem2.id,
        },
      });

      const scrap3 = await prisma.scrap.create({
        data: {
          userId: otherUser2.id,
          poemId: poem2.id,
        },
      });

      // when
      const response = await request(app.getHttpServer())
        .get(`/user/profile`)
        .set('Authorization', `Bearer ${accessToken}`);
      const { status, body } = response;

      // then
      expect(status).toEqual(200);
      expect(body).toMatchObject({
        id: user!.id,
        name: 'test',
        ink: 0,
        introduction: null,
        mainAchievement: {
          id: achievement1.id,
          name: '멋진 업적',
          icon: 'https://icon.com',
          description: '획득 조건',
        },
        achievements: [
          {
            id: achievement1.id,
            name: '멋진 업적',
            icon: 'https://icon.com',
            description: '획득 조건',
          },
        ],
        scrapUsers: [
          {
            id: otherUser1.id,
            name: 'other-user1',
            icon: null,
            count: 2,
          },
          {
            id: otherUser2.id,
            name: 'other-user2',
            icon: null,
            count: 1,
          },
        ],
      });
    });
  });

  describe('PUT /user - 회원 정보 수정', () => {
    it('회원 정보 수정', async () => {
      // given
      const { accessToken, name } = await login(app);
      const user = await prisma.user.findFirst({
        where: { name },
      });

      const dto: UpdateUserDto = {
        name: 'new-name',
        introduction: 'new-introduction',
      };

      // when
      const response = await request(app.getHttpServer())
        .put('/user')
        .send(dto)
        .set('Authorization', `Bearer ${accessToken}`);
      const { status } = response;

      const updatedUser = await prisma.user.findUnique({
        where: { id: user!.id },
      });

      // then
      expect(status).toEqual(204);
      expect(updatedUser!.name).toEqual(dto.name);
      expect(updatedUser!.introduction).toEqual(dto.introduction);
    });
  });
});
