import {
  Controller,
  Post,
  Body,
  HttpException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, SignupDto } from './dto/request';
import { JwtGuard } from './guards';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    try {
      return await this.authService.login(loginDto);
    } catch (e) {
      if (e instanceof Error) {
        if (e.message === 'user not found') {
          throw new HttpException('user not found', 404);
        }
      }
    }
  }

  @Post('signup')
  async signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }

  @Post('test')
  @UseGuards(JwtGuard)
  async test() {
    return 'test';
  }
}
