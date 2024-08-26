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
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiConsumes,
  ApiQuery,
} from '@nestjs/swagger';
import {
  AnalyzePoemDto,
  UpdateTagDto,
  CreatePoemDto,
  GetPoemsDto,
  PlayDto,
} from './dto/request';
import { TagsDto, ContentDto, NewPoemDto, PoemDto } from './dto/response';
import { PoemService } from './poem.service';
import { CurrentUser } from '../common/decorators';
import { JwtGuard } from '../auth/guards';

@ApiTags('poems')
@ApiBearerAuth()
@ApiResponse({ status: 401, description: '인증되지 않은 사용자입니다.' })
@ApiResponse({ status: 400, description: '유효성검사 실패' })
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
    status: 423,
    description: '하루에 두 번만 작성할 수 있습니다.',
  })
  @Get('can-write')
  async canWrite(@CurrentUser() userId: string) {
    const result = await this.poemService.canWrite(userId);
    if (result) {
      return;
    } else {
      throw new HttpException('하루에 두 번만 작성할 수 있습니다.', 423);
    }
  }

  @ApiOperation({ summary: '알고리즘에 의해 시를 3개씩 반환해줌' })
  @ApiQuery({
    name: 'emotion',
    required: false,
    description: '기분이 모르겠음 일때는 안보내주시면 됩니다.',
  })
  @ApiQuery({ name: 'index', required: true, description: '0부터 시작합니다.' })
  @ApiResponse({ status: 200, type: PoemDto, isArray: true })
  @Get()
  async getThree(
    @Query() { emotion, index }: GetPoemsDto,
    @CurrentUser() userId: string,
  ): Promise<PoemDto[]> {
    return await this.poemService.getThree({ emotion, index, userId });
  }

  @ApiOperation({ summary: '낭독 오디오 플레이' })
  @ApiResponse({
    status: 200,
    description: '낭독 횟수 증가, responsebody는 없습니다.',
  })
  @Get(':id/play')
  async play(@Param() { id }: PlayDto) {
    await this.poemService.play(id);
    return;
  }
}
