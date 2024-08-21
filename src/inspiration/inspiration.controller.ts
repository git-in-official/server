import { Controller, Get, UseGuards, HttpException } from '@nestjs/common';
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
@UseGuards(JwtGuard)
@Controller('inspirations')
export class InspirationController {
  constructor(private readonly inspirationService: InspirationService) {}

  @ApiOperation({
    summary: '제목 글감 받기 - 하루마다 랜덤으로 바뀜',
  })
  @ApiResponse({ status: 200, type: TitleDto })
  @ApiResponse({
    status: 404,
    description:
      'no inspiration - 데이터베이스에 글감이 없어서 나는 에러입니다.',
  })
  @Get('title')
  async getTitle() {
    try {
      return await this.inspirationService.getTitle();
    } catch (e) {
      if (e instanceof Error) {
        if (e.message === 'no inspiration') {
          throw new HttpException('no inspiration', 404);
        } else {
          throw e;
        }
      }
    }
  }

  @ApiOperation({
    summary: '단어 글감 받기 - 현재는 하드코딩. 기획이 확정나면 추가 구현 예정',
  })
  @ApiResponse({ status: 200, type: WordDto })
  @ApiResponse({
    status: 404,
    description:
      'no inspiration - 데이터베이스에 글감이 없어서 나는 에러입니다.',
  })
  @Get('word')
  @UseGuards(JwtGuard)
  async getWord() {
    try {
      return await this.inspirationService.getWord();
    } catch (e) {
      if (e instanceof Error) {
        if (e.message === 'no inspiration') {
          throw new HttpException('no inspiration', 404);
        } else {
          throw e;
        }
      }
    }
  }
}
