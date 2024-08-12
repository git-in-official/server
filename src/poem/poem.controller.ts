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
import { AnaylsisPoemDto, ChangeTagDto, CreatePoemDto } from './dto/request';
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
    summary:
      '시 태그 분석 - 현재는 하드코딩, 감정에 대한 기획이 완료되면 추가구현',
  })
  @ApiBody({ type: AnaylsisPoemDto })
  @ApiResponse({ status: 200, type: TagsDto })
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
      '시 태그 수정 - 현재는 하드코딩, 감정에 대한 기획이 완료되면 추가구현',
  })
  @ApiBody({ type: ChangeTagDto })
  @ApiResponse({ status: 200, type: ContentDto })
  @HttpCode(200)
  @Patch('tag')
  async changeEmotion(@Body() changeEmotionDto: ChangeTagDto) {
    return this.poemService.changeEmotion({
      ...changeEmotionDto,
    });
  }

  @ApiOperation({ summary: '탈고' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreatePoemDto })
  @ApiResponse({ status: 201, type: NewPoemDto })
  @Post()
  @UseInterceptors(FileInterceptor('audioFile'))
  async createPoem(
    @Req() req: JwtRequest,
    @Body() createPoemDto: CreatePoemDto,
    @UploadedFile() audioFile?: Express.Multer.File,
  ) {
    console.log(createPoemDto);
    return this.poemService.createPoem(req.user.id, {
      ...createPoemDto,
      audioFile,
    });
  }
}
