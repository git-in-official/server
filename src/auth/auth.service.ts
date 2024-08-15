import { Injectable } from '@nestjs/common';
import { GoogleProfile } from './dto';
import { UserRepository } from 'src/user/user.repository';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}
  async login({
    provider,
    providerAccessToken,
  }: {
    provider: 'GOOGLE' | 'APPLE';
    providerAccessToken: string;
  }) {
    if (provider === 'GOOGLE') {
      const profile = await this.getGoogleProfile(providerAccessToken);
      const user = await this.userRepository.findOneByProvider(
        provider,
        profile.id,
      );
      if (!user) {
        throw new Error('user not found');
      }
      const jwtAccessToken = await this.createAccessToken(user.id);
      return { accessToken: jwtAccessToken };
    }
  }

  async signup({
    provider,
    providerAccessToken,
    name,
  }: {
    provider: 'GOOGLE' | 'APPLE';
    providerAccessToken: string;
    name: string;
  }) {
    if (provider === 'GOOGLE') {
      const profile = await this.getGoogleProfile(providerAccessToken);
      const newUser = await this.userRepository.create({
        provider,
        providerId: profile.id,
        name,
      });
      const jwtAccessToken = await this.createAccessToken(newUser.id);
      return { accessToken: jwtAccessToken };
    }
  }

  async getGoogleProfile(accessToken: string): Promise<GoogleProfile> {
    const response = await fetch(
      `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${accessToken}`,
    );
    return await response.json();
  }

  async createAccessToken(userId: string) {
    return this.jwtService.sign({ id: userId });
  }
}
