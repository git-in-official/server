import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
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
import { InspirationService } from 'src/inspiration/inspiration.service';

@ApiTags('admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly inspirationService: InspirationService) {}

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
}
