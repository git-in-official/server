import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  ParseUUIDPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AchievementService } from './achievement.service';
import { JwtGuard } from '../auth/guards';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AchievementsDto } from './dto/response';
import { CurrentUser } from '../common/decorators';

@ApiTags('achievements')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('achievements')
export class AchievementController {
  constructor(private readonly achievementService: AchievementService) {}

  @ApiOperation({
    summary: '자신이 획득한 업적 조회',
    description:
      '모든 업적을 조회하고 로그인 한 회원의 획득 유무를 isAquired로 표시합니다.',
  })
  @ApiResponse({ status: 200, type: [AchievementsDto] })
  @ApiResponse({ status: 404, description: 'user not found' })
  @Get('my')
  async getAll(@CurrentUser() userId: string) {
    try {
      return await this.achievementService.getAll(userId);
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
    summary: '특정 회원이 획득한 모든 업적 조회',
    deprecated: true,
  })
  @ApiResponse({ status: 200, type: [AchievementsDto] })
  @ApiResponse({ status: 404, description: 'user not found' })
  @Get('user')
  async getAllByUserId(@Query('userId', ParseUUIDPipe) userId: string) {
    try {
      return await this.achievementService.getAllByUserId(userId);
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
