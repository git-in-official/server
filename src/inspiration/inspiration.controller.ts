import {
  Controller,
  Get,
  UseGuards,
  HttpException,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  getSchemaPath,
} from '@nestjs/swagger';
import { InspirationService } from './inspiration.service';
import { TextInspirationDto, FileInspirationDto } from './dto/response';
import { GetInspirationQueryDto } from './dto/request';
import { JwtGuard } from '../auth/guards';

@ApiTags('inspirations')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('inspirations')
export class InspirationController {
  constructor(private readonly inspirationService: InspirationService) {}

  @ApiOperation({
    summary: '글감 받기 - 하루마다 랜덤으로 바뀜',
  })
  @ApiQuery({ name: 'type', enum: ['WORD', 'TITLE', 'AUDIO', 'VIDEO'] })
  @ApiResponse({
    status: 200,
    schema: {
      oneOf: [
        { $ref: getSchemaPath(TextInspirationDto) },
        { $ref: getSchemaPath(FileInspirationDto) },
      ],
    },
  })
  @Get()
  async getOne(
    @Query() { type }: GetInspirationQueryDto,
  ): Promise<TextInspirationDto | FileInspirationDto> {
    try {
      if (type === 'WORD') {
        return await this.inspirationService.getWord();
      } else if (type === 'TITLE') {
        return await this.inspirationService.getTitle();
      } else if (type === 'AUDIO') {
        return await this.inspirationService.getAudio();
      } else {
        // type === 'video'
        return await this.inspirationService.getVideo();
      }
    } catch (e) {
      if (e instanceof Error) {
        if (e.message === 'no inspiration') {
          throw new HttpException('no inspiration', 404);
        }
      }
      throw e;
    }
  }

  // @ApiOperation({
  //   summary: '제목 글감 받기 - 하루마다 랜덤으로 바뀜',
  // })
  // @ApiResponse({ status: 200, type: TitleDto })
  // @ApiResponse({
  //   status: 404,
  //   description:
  //     'no inspiration - 데이터베이스에 글감이 없어서 나는 에러입니다.',
  // })
  // @Get('title')
  // async getTitle() {
  //   try {
  //     return await this.inspirationService.getTitle();
  //   } catch (e) {
  //     if (e instanceof Error) {
  //       if (e.message === 'no inspiration') {
  //         throw new HttpException('no inspiration', 404);
  //       }
  //     }
  //     throw e;
  //   }
  // }

  // @ApiOperation({
  //   summary: '단어 글감 받기 - 하루마다 랜덤으로 바뀜',
  // })
  // @ApiResponse({ status: 200, type: WordDto })
  // @ApiResponse({
  //   status: 404,
  //   description:
  //     'no inspiration - 데이터베이스에 글감이 없어서 나는 에러입니다.',
  // })
  // @Get('word')
  // async getWord() {
  //   try {
  //     return await this.inspirationService.getWord();
  //   } catch (e) {
  //     if (e instanceof Error) {
  //       if (e.message === 'no inspiration') {
  //         throw new HttpException('no inspiration', 404);
  //       }
  //     }
  //     throw e;
  //   }
  // }

  // @ApiOperation({ summary: '오디오 글감 받기 - 하루마다 랜덤으로 바뀜' })
  // @ApiResponse({ status: 200, type: AudioDto })
  // @ApiResponse({
  //   status: 404,
  //   description:
  //     'no inspiration - 데이터베이스에 글감이 없어서 나는 에러입니다.',
  // })
  // @Get('audio')
  // async getAudio() {
  //   try {
  //     return await this.inspirationService.getAudio();
  //   } catch (e) {
  //     if (e instanceof Error) {
  //       if (e.message === 'no inspiration') {
  //         throw new HttpException('no inspiration', 404);
  //       }
  //     }
  //     throw e;
  //   }
  // }

  // @ApiOperation({ summary: '비디오 글감 받기 - 하루마다 랜덤으로 바뀜' })
  // @ApiResponse({ status: 200, type: VideoDto })
  // @ApiResponse({
  //   status: 404,
  //   description:
  //     'no inspiration - 데이터베이스에 글감이 없어서 나는 에러입니다.',
  // })
  // @Get('video')
  // async getVideo() {
  //   try {
  //     return await this.inspirationService.getVideo();
  //   } catch (e) {
  //     if (e instanceof Error) {
  //       if (e.message === 'no inspiration') {
  //         throw new HttpException('no inspiration', 404);
  //       }
  //     }
  //     throw e;
  //   }
  // }
}
