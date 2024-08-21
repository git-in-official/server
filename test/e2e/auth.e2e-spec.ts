import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthService } from 'src/auth/auth.service';

describe('Auth (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let authService: AuthService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prisma = moduleFixture.get<PrismaService>(PrismaService);
    authService = moduleFixture.get<AuthService>(AuthService);

    jest.spyOn(authService, 'getGoogleProfile').mockResolvedValue({
      id: 'test-id',
      email: 'test@test.com',
      picture: 'https://picture.com',
      verified_email: true,
    });
  });

  afterEach(async () => {
    await prisma.user.deleteMany();
  });

  describe('POST /auth/signup - 회원가입', () => {
    it('필명에 공백문자가 들어가면 400을 반환한다', async () => {
      // given
      const signupDto = {
        provider: 'GOOGLE',
        providerAccessToken: 'test-token',
        name: 'test name',
      };

      // when
      const response = await request(app.getHttpServer())
        .post('/auth/signup')
        .send(signupDto);

      // then
      expect(response.status).toBe(400);
    });

    it('필명에 밑줄과 하이픈이 아닌 특수문자가 들어가면 400을 반환한다', async () => {
      // given
      const signupDto = {
        provider: 'GOOGLE',
        providerAccessToken: 'test-token',
        name: 'test!name',
      };

      // when
      const response = await request(app.getHttpServer())
        .post('/auth/signup')
        .send(signupDto);

      // then
      expect(response.status).toBe(400);
    });

    it('필명이 2글자 미만일때 400을 반환한다', async () => {
      // given
      const signupDto = {
        provider: 'GOOGLE',
        providerAccessToken: 'test-token',
        name: 't',
      };

      // when
      const response = await request(app.getHttpServer())
        .post('/auth/signup')
        .send(signupDto);

      // then
      expect(response.status).toBe(400);
    });

    it('필명이 14글자 초과일때 400을 반환한다', async () => {
      // given
      const signupDto = {
        provider: 'GOOGLE',
        providerAccessToken: 'test-token',
        name: 'testtesttesttest',
      };

      // when
      const response = await request(app.getHttpServer())
        .post('/auth/signup')
        .send(signupDto);

      // then
      expect(response.status).toBe(400);
    });

    it('회원가입이 정상적으로 이루어지면 201과 함께 토큰을 반환하며 데이터베이스에 유저가 생성된다', async () => {
      // given
      const signupDto = {
        provider: 'GOOGLE',
        providerAccessToken: 'test-token',
        name: 'test-name',
      };

      // when
      const response = await request(app.getHttpServer())
        .post('/auth/signup')
        .send(signupDto);

      // then
      expect(response.status).toBe(201);
      expect(response.body.accessToken).toBeDefined();

      const user = await prisma.user.findFirst({
        where: {
          name: signupDto.name,
        },
      });
      expect(user!.name).toBe(signupDto.name);
    });
  });

  describe('POST /auth/login - 로그인', () => {
    it('존재하지 않는 유저일 경우 404를 반환한다', async () => {
      // given
      const loginDto = {
        provider: 'GOOGLE',
        providerAccessToken: 'test-token',
      };

      // when
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto);

      // then
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('user not found');
    });

    it('존재하는 유저일 경우 200과 함께 accessToken을 반환한다', async () => {
      // given
      const user = await prisma.user.create({
        data: {
          provider: 'GOOGLE',
          providerId: 'test-id',
          name: 'test-name',
        },
      });
      const loginDto = {
        provider: 'GOOGLE',
        providerAccessToken: 'test-token',
      };

      // when
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto);

      // then
      expect(response.status).toBe(200);
      expect(response.body.accessToken).toBeDefined();
    });

    it('provider에 GOOGLE과 APPLE이 아닌 값이 들어오면 400을 반환한다', async () => {
      // given
      const loginDto = {
        provider: 'KAKAO',
        providerAccessToken: 'test-token',
      };

      // when
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto);

      // then
      expect(response.status).toBe(400);
    });
  });
});
