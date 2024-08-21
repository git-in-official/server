import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { SignupDto } from '../../../src/auth/dto/request';
import { JwtDto } from '../../../src/auth/dto/response';

export const login = async (app: INestApplication) => {
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
