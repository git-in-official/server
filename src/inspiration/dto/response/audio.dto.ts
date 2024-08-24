import { ApiProperty } from '@nestjs/swagger';

export class AudioDto {
  @ApiProperty({ description: '음성 글감 ID - 시 탈고 api에 필요한정보입니다' })
  readonly id: string;
  @ApiProperty()
  readonly filename: string;
  @ApiProperty()
  readonly audioUrl: string;
}
