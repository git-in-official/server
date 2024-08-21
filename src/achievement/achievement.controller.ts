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

@ApiTags('achievements')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('achievements')
export class AchievementController {
  constructor(private readonly achievementService: AchievementService) {}

  @ApiOperation({
    summary: '모든 업적 조회',
  })
  @ApiResponse({ status: 200, type: [AchievementsDto] })
  @Get()
  async getAll() {
    return await this.achievementService.getAll();
  }

  @ApiOperation({
    summary: '특정 회원이 획득한 모든 업적 조회',
  })
  @ApiResponse({ status: 200, type: [AchievementsDto] })
  @Get('user')
  async getAllByUserId(@Query('userId', ParseUUIDPipe) userId: string) {
    return await this.achievementService.getAllByUserId(userId);
  }
}
