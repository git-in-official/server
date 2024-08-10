import {
  Controller,
  Post,
  Body,
  HttpException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto, SignupDto } from './dto/request';
import { JwtGuard } from './guards';
import { JwtDto } from './dto/response';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Login' })
  @ApiResponse({ status: 201, type: JwtDto })
  @ApiResponse({ status: 404, description: 'user not found' })
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

  @ApiOperation({ summary: 'Signup' })
  @ApiResponse({ status: 201, type: JwtDto })
  @Post('signup')
  async signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }

  @Post('test')
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  async test() {
    return 'test';
  }
}
