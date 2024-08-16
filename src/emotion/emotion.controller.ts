import { Controller, Get } from '@nestjs/common';
import { EmotionService } from './emotion.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { EmotionDto } from './dto/response';

@ApiTags('emotions')
@Controller('emotions')
export class EmotionController {
  constructor(private readonly emotionService: EmotionService) {}

  @ApiOperation({ summary: '감정 리스트 조회' })
  @ApiResponse({ status: 200, type: [EmotionDto] })
  @Get()
  async getAll() {
    return this.emotionService.getAll();
  }
}
