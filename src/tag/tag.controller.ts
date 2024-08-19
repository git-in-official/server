import { Controller, Get } from '@nestjs/common';
import { TagService } from './tag.service';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { TagsDto } from './dto/response';

@ApiTags('tags')
@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @ApiOperation({ summary: '테마와 상호작용 목록 조회' })
  @ApiResponse({ status: 200, type: TagsDto })
  @Get()
  getAll() {
    return this.tagService.getAll();
  }
}
