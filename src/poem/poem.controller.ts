import { Controller, Post, UseGuards, Body, HttpCode } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';
import { AnaylsisPoemDto } from './dto/request';
import { EmotionsDto } from './dto/response';
import { PoemService } from './poem.service';

@ApiTags('poem')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('poem')
export class PoemController {
  constructor(private readonly poemService: PoemService) {}

  @ApiOperation({ summary: '시 감정분석 - 현재는 하드코딩입니다.' })
  @ApiBody({ type: AnaylsisPoemDto })
  @ApiResponse({ status: 200, type: EmotionsDto })
  @HttpCode(200)
  @Post('analysis')
  async analysis(@Body() analysisPoemDto: AnaylsisPoemDto) {
    return this.poemService.analysisPoem(
      analysisPoemDto.title,
      analysisPoemDto.content,
    );
  }
}
