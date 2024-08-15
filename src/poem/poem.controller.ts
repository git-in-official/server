import {
  Controller,
  Post,
  UseGuards,
  Body,
  HttpCode,
  Patch,
  Req,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtGuard } from 'src/auth/guards';
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
import { JwtRequest } from 'src/auth/requests';

@ApiTags('poem')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('poem')
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
    @Req() req: JwtRequest,
    @Body() createPoemDto: CreatePoemDto,
    @UploadedFile() audioFile?: Express.Multer.File,
  ) {
    console.log(createPoemDto);
    return await this.poemService.create(req.user.id, {
      ...createPoemDto,
      audioFile,
    });
  }
}
