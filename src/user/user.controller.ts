import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Patch,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { CurrentUser } from '../common/decorators';
import { JwtGuard } from '../auth/guards';
import { ProfileDto } from './dto/response';
import { UpdateUserDto } from './dto/request';

@ApiTags('user')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: '자신의 프로필 정보 조회',
    description: '프로필 정보와 최다 스크랩 유저 10명을 조회합니다.',
  })
  @ApiResponse({ status: 200, type: ProfileDto })
  @ApiResponse({ status: 404, description: 'user not found' })
  @Get('profile')
  async getOneDetailById(@CurrentUser() userId: string): Promise<ProfileDto> {
    try {
      return await this.userService.getOneDetailById(userId);
    } catch (e: unknown) {
      if (e instanceof Error) {
        if (e.message === 'user not found') {
          throw new HttpException(e.message, HttpStatus.NOT_FOUND);
        } else {
          throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
      }
      throw e;
    }
  }

  @ApiOperation({
    summary: '회원 정보 수정',
    description: '업데이트 성공 시 body는 없습니다.',
  })
  @ApiResponse({ status: 204 })
  @ApiResponse({ status: 404, description: 'user not found' })
  @HttpCode(204)
  @Put()
  async update(@Body() dto: UpdateUserDto, @CurrentUser() userId: string) {
    try {
      await this.userService.update(userId, dto);
    } catch (e: unknown) {
      if (e instanceof Error) {
        if (e.message === 'user not found') {
          throw new HttpException(e.message, HttpStatus.NOT_FOUND);
        } else {
          throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
      }
      throw e;
    }
  }

  @ApiOperation({
    summary: '메인 업적 변경',
    description: '업데이트 성공 시 body는 없습니다.',
  })
  @ApiResponse({ status: 204 })
  @ApiResponse({ status: 404, description: 'user not found' })
  @HttpCode(204)
  @Patch('achievement')
  async updateMainAchievement(
    @Query('achievementId') achievementId: string,
    @CurrentUser() userId: string,
  ) {
    try {
      await this.userService.updateMainAchievement(userId, achievementId);
    } catch (e: unknown) {
      if (e instanceof Error) {
        if (e.message === 'user not found') {
          throw new HttpException(e.message, HttpStatus.NOT_FOUND);
        } else {
          throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
      }
      throw e;
    }
  }
}
