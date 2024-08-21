import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { InspirationService } from './inspiration.service';
import { TitleDto, WordDto } from './dto/response';
import { JwtGuard } from '../auth/guards';

@ApiTags('inspirations')
@ApiBearerAuth()
@Controller('inspirations')
export class InspirationController {
  constructor(private readonly inspirationService: InspirationService) {}

  @ApiOperation({
    summary: '제목 글감 받기 - 하루마다 랜덤으로 바뀜',
  })
  @ApiResponse({ status: 200, type: TitleDto })
  @Get('title')
  @UseGuards(JwtGuard)
  async getTitle() {
    return await this.inspirationService.getTitle();
  }

  @ApiOperation({
    summary: '단어 글감 받기 - 현재는 하드코딩. 기획이 확정나면 추가 구현 예정',
  })
  @ApiResponse({ status: 200, type: WordDto })
  @Get('word')
  @UseGuards(JwtGuard)
  async getWord() {
    return this.inspirationService.getWord();
  }
}
