import {
  Controller,
  Get,
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
  @Get('my')
  async getAll(@CurrentUser() userId: string) {
    return await this.achievementService.getAll(userId);
  }

  @ApiOperation({
    summary: '특정 회원이 획득한 모든 업적 조회',
    deprecated: true,
  })
  @ApiResponse({ status: 200, type: [AchievementsDto] })
  @Get('user')
  async getAllByUserId(@Query('userId', ParseUUIDPipe) userId: string) {
    return await this.achievementService.getAllByUserId(userId);
  }
}
