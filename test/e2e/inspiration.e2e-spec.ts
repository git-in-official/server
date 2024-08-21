import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthService } from 'src/auth/auth.service';
import { SignupDto } from 'src/auth/dto/request';
import { JwtDto } from 'src/auth/dto/response';
import { InspirationService } from 'src/inspiration/inspiration.service';

describe('Inspiration (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let authService: AuthService;
  let inspirationService: InspirationService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    prisma = moduleFixture.get<PrismaService>(PrismaService);
    authService = moduleFixture.get<AuthService>(AuthService);
    inspirationService =
      moduleFixture.get<InspirationService>(InspirationService);

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
    await prisma.titleInspiration.deleteMany();
    await prisma.user.deleteMany();
  });

  describe('GET /inspirations/title - 제목 글감 받기', () => {
    it('제목 글감을 반환한다', async () => {
      // given
      const { accessToken } = await login(app);

      await prisma.titleInspiration.create({
        data: {
          title: 'test-title',
        },
      });

      // when
      const { status, body } = await request(app.getHttpServer())
        .get('/inspirations/title')
        .set('Authorization', `Bearer ${accessToken}`);

      // then
      expect(status).toBe(200);
      expect(body.title).toBe('test-title');
    });
  });

  it('글감이 없으면 404를 반환한다', async () => {
    // given
    const { accessToken } = await login(app);

    // when
    const { status } = await request(app.getHttpServer())
      .get('/inspirations/title')
      .set('Authorization', `Bearer ${accessToken}`);

    // then
    expect(status).toBe(404);
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
