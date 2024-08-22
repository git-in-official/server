import {
  Controller,
  Post,
  UseGuards,
  Body,
  HttpCode,
  Patch,
  UseInterceptors,
  UploadedFile,
  Param,
  Get,
  HttpException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiConsumes,
} from '@nestjs/swagger';
import { AnalyzePoemDto, UpdateTagDto, CreatePoemDto } from './dto/request';
import { TagsDto, ContentDto, NewPoemDto } from './dto/response';
import { PoemService } from './poem.service';
import { CurrentUser } from '../common/decorators';
import { JwtGuard } from '../auth/guards';

@ApiTags('poems')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('poems')
export class PoemController {
  constructor(private readonly poemService: PoemService) {}

  @ApiOperation({
    summary: '시 태그 분석',
  })
  @ApiBody({ type: AnalyzePoemDto })
  @ApiResponse({ status: 200, type: TagsDto })
  @HttpCode(200)
  @Post('analyze')
  async analysis(@Body() analyzePoemDto: AnalyzePoemDto) {
    return await this.poemService.analyzePoem(
      analyzePoemDto.title,
      analyzePoemDto.content,
    );
  }

  @ApiOperation({
    summary: '시 태그 수정 - 3~4초 정도 걸립니다',
  })
  @ApiBody({ type: UpdateTagDto })
  @ApiResponse({ status: 200, type: ContentDto })
  @HttpCode(200)
  @Patch('tag')
  async updateTag(@Body() updateTagDto: UpdateTagDto) {
    return await this.poemService.updateTag({
      ...updateTagDto,
    });
  }

  @ApiOperation({ summary: '탈고' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreatePoemDto })
  @ApiResponse({ status: 201, type: NewPoemDto })
  @Post()
  @UseInterceptors(FileInterceptor('audioFile'))
  async create(
    @CurrentUser() userId: string,
    @Body() createPoemDto: CreatePoemDto,
    @UploadedFile() audioFile?: Express.Multer.File,
  ) {
    console.log(audioFile);
    return await this.poemService.create(userId, {
      ...createPoemDto,
      audioFile,
    });
  }

  @ApiOperation({
    summary: '시 스크랩',
    description: '응답 body x, 상태 코드로 성공 실패 판별.',
  })
  @ApiResponse({ status: 201 })
  @Post(':id/scrap')
  async scrap(@Param('id') poemId: string, @CurrentUser() userId: string) {
    return await this.poemService.scrap(poemId, userId);
  }

  @ApiOperation({
    summary: '시를 쓸 수 있는지 확인하기 - 하루 두 번만 글쓸수있음',
  })
  @ApiResponse({
    status: 200,
    description: '시를 쓸 수 있음. 따로 응답 body는 없습니다.',
  })
  @ApiResponse({
    status: 400,
    description: '하루에 두 번만 작성할 수 있습니다.',
  })
  @Get('can-write')
  async canWrite(@CurrentUser() userId: string) {
    const result = await this.poemService.canWrite(userId);
    if (result) {
      return;
    } else {
      throw new HttpException('하루에 두 번만 작성할 수 있습니다.', 400);
    }
  }
}
