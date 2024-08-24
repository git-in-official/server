import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { CurrentUser } from '../common/decorators';
import { JwtGuard } from '../auth/guards';
import { ProfileDto } from './dto/response/profile';

@ApiTags('user')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: '자신의 프로필 정보 조회',
    description: '프로필 정보와 최다 스크랩 유저 10명을 조회합니다.',
  })
  @ApiResponse({ status: 200, type: ProfileDto })
  @Get('profile')
  async getOneDetailById(@CurrentUser() userId: string): Promise<ProfileDto> {
    return await this.userService.getOneDetailById(userId);
  }
}
