import {
  Controller,
  Post,
  Body,
  HttpException,
  UseGuards,
  HttpCode,
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
  @ApiResponse({ status: 200, type: JwtDto })
  @ApiResponse({ status: 404, description: 'user not found' })
  @Post('login')
  @HttpCode(200)
  async login(@Body() loginDto: LoginDto): Promise<JwtDto> {
    try {
      return await this.authService.login(loginDto);
    } catch (e) {
      if (e instanceof Error) {
        if (e.message === 'user not found') {
          throw new HttpException('user not found', 404);
        }
      }
      throw e;
    }
  }

  @ApiOperation({ summary: 'Signup' })
  @ApiResponse({ status: 201, type: JwtDto })
  @ApiResponse({ status: 400, description: '유효성 검사 실패' })
  @Post('signup')
  async signup(@Body() signupDto: SignupDto): Promise<JwtDto> {
    return this.authService.signup(signupDto);
  }

  @Post('test')
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  async test() {
    return 'test';
  }
}
