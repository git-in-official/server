import { Injectable, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../user/user.repository';
import { AuthTypes } from '../types';

@Injectable()
export class AuthService {
  constructor(
    @Inject(UserRepository) private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}
  async login({
    provider,
    providerAccessToken,
  }: {
    provider: 'GOOGLE';
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
      return { accessToken: jwtAccessToken, name: user.name };
    } else {
      throw new Error('invalid provider');
    }
  }

  async signup({
    provider,
    providerAccessToken,
    name,
  }: {
    provider: 'GOOGLE';
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
      return { accessToken: jwtAccessToken, name: newUser.name };
    } else {
      throw new Error('invalid provider');
    }
  }

  async getGoogleProfile(
    accessToken: string,
  ): Promise<AuthTypes.GoogleProfile> {
    const response = await fetch(
      `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${accessToken}`,
    );
    if (!response.ok) {
      throw new Error('failed to get google profile');
    }
    return await response.json();
  }

  async createAccessToken(userId: string) {
    return this.jwtService.sign({ id: userId });
  }
}
