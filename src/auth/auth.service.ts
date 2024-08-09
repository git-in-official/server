import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  async login({
    provider,
    accessToken,
  }: {
    provider: 'google' | 'apple';
    accessToken: string;
  }) {
    if (provider === 'google') {
      const profile = await this.getGoogleProfile(accessToken);
      console.log(profile);
    }
  }

  async getGoogleProfile(accessToken: string) {
    const response = await fetch(
      `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${accessToken}`,
    );
    return await response.json();
  }
}
