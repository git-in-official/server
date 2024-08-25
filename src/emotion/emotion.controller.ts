import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { EmotionService } from './emotion.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { EmotionDto } from './dto/response';
import { EmotionSelectDto } from './dto/request';
import { JwtGuard } from 'src/auth/guards';
import { CurrentUser } from 'src/common/decorators';

@ApiTags('emotions')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('emotions')
export class EmotionController {
  constructor(private readonly emotionService: EmotionService) {}

  @ApiOperation({ summary: '감정 리스트 조회' })
  @ApiResponse({ status: 200, type: [EmotionDto] })
  @Get()
  async getAll(@CurrentUser() userId: string) {
    return this.emotionService.getAll(userId);
  }

  @ApiOperation({ summary: '감정 선택했을 때 내역 저장하는 API' })
  @ApiResponse({ status: 201 })
  @Post('select')
  async select(
    @Body() { emotion }: EmotionSelectDto,
    @CurrentUser() userId: string,
  ) {
    return this.emotionService.select(userId, emotion);
  }
}
