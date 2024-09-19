import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  Get,
  Param,
  Patch,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadInspirationDto } from './dto/request';
import {
  ProofreadingPoemDto,
  TitleInspirationDto,
  WordInspirationDto,
  AudioInspirationDto,
  VideoInspirationDto,
} from './dto/response';
import { InspirationService } from 'src/inspiration/inspiration.service';
import { PoemService } from 'src/poem/poem.service';

@ApiTags('admin')
@Controller('admin')
export class AdminController {
  constructor(
    private readonly inspirationService: InspirationService,
    private readonly poemService: PoemService,
  ) {}

  @ApiOperation({ summary: '글감 업로드' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UploadInspirationDto })
  @ApiResponse({ status: 201, description: '글감 업로드 성공' })
  @Post('inspirations')
  @UseInterceptors(FileInterceptor('file'))
  async createAudioInspiration(
    @Body() body: UploadInspirationDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (body.type === 'TITLE') {
      await this.inspirationService.createTitle(body.text!);
    } else if (body.type === 'WORD') {
      await this.inspirationService.createWord(body.text!);
    } else if (body.type === 'AUDIO') {
      await this.inspirationService.createAudio(file!);
    } else if (body.type === 'VIDEO') {
      await this.inspirationService.createVideo(file!);
    }
  }

  @ApiOperation({ summary: '교정중인 시 목록 조회 (탈고만 된거)' })
  @ApiResponse({ status: 200, type: [ProofreadingPoemDto] })
  @Get('poems/proofreading')
  async findAllProofreading(): Promise<ProofreadingPoemDto[]> {
    return await this.poemService.getProofreadingList();
  }

  @ApiOperation({ summary: '출판' })
  @ApiResponse({ status: 200, description: '출판 성공' })
  @Patch('poems/proofreading/:id/publish')
  async publish(@Param('id', ParseUUIDPipe) id: string) {
    await this.poemService.publish(id);
    return;
  }

  @ApiOperation({ summary: '제목 글감 리스트 조회' })
  @ApiResponse({ status: 200, type: [TitleInspirationDto] })
  @Get('inspirations/titles')
  async getAllTitles(): Promise<TitleInspirationDto[]> {
    return await this.inspirationService.getAllTitles();
  }

  @ApiOperation({ summary: '단어 글감 리스트 조회' })
  @ApiResponse({ status: 200, type: [WordInspirationDto] })
  @Get('inspirations/words')
  async getAllWords(): Promise<WordInspirationDto[]> {
    return await this.inspirationService.getAllWords();
  }

  @ApiOperation({ summary: '음성 글감 리스트 조회' })
  @ApiResponse({ status: 200, type: [AudioInspirationDto] })
  @Get('inspirations/audios')
  async getAllAudios(): Promise<AudioInspirationDto[]> {
    return await this.inspirationService.getAllAudios();
  }

  @ApiOperation({ summary: '영상 글감 리스트 조회' })
  @ApiResponse({ status: 200, type: [VideoInspirationDto] })
  @Get('inspirations/videos')
  async getAllVideos(): Promise<VideoInspirationDto[]> {
    return await this.inspirationService.getAllVideos();
  }
}
