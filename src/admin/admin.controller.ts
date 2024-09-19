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
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiResponse,
  ApiQuery,
  getSchemaPath,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadInspirationDto, GetAllInspirationsDto } from './dto/request';
import {
  ProofreadingPoemDto,
  AdminTextInspirationDto,
  AdminFileInspirationDto,
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

  @ApiOperation({ summary: '전체 글감 리스트 조회' })
  @ApiQuery({ name: 'type', enum: ['TITLE', 'WORD', 'AUDIO', 'VIDEO'] })
  @ApiResponse({
    status: 200,
    schema: {
      oneOf: [
        { $ref: getSchemaPath(AdminTextInspirationDto) },
        { $ref: getSchemaPath(AdminFileInspirationDto) },
      ],
    },
  })
  @Get('inspirations')
  async getAllInspirations(
    @Query() { type }: GetAllInspirationsDto,
  ): Promise<AdminTextInspirationDto[] | AdminFileInspirationDto[]> {
    if (type === 'TITLE') {
      return await this.inspirationService.getAllTitles();
    } else if (type === 'WORD') {
      return await this.inspirationService.getAllWords();
    } else if (type === 'AUDIO') {
      return await this.inspirationService.getAllAudios();
    } else {
      return await this.inspirationService.getAllVideos();
    }
  }
}
