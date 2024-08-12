import {
  Controller,
  Post,
  UseGuards,
  Body,
  HttpCode,
  Patch,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';
import { AnaylsisPoemDto, ChangeEmotionDto } from './dto/request';
import { EmotionsDto, ContentDto } from './dto/response';
import { PoemService } from './poem.service';

@ApiTags('poem')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('poem')
export class PoemController {
  constructor(private readonly poemService: PoemService) {}

  @ApiOperation({
    summary:
      '시 감정분석 - 현재는 하드코딩, 감정에 대한 기획이 완료되면 추가구현',
  })
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

  @ApiOperation({
    summary:
      '시 감정태그 수정 - 현재는 하드코딩, 감정에 대한 기획이 완료되면 추가구현',
  })
  @ApiBody({ type: ChangeEmotionDto })
  @ApiResponse({ status: 200, type: ContentDto })
  @HttpCode(200)
  @Patch('emotion')
  async changeEmotion(@Body() changeEmotionDto: ChangeEmotionDto) {
    return this.poemService.changeEmotion({
      ...changeEmotionDto,
    });
  }
}
