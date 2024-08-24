import { ApiProperty } from '@nestjs/swagger';
import { themes, interactions } from 'src/constants/tags';

export class PoemDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  textAlign: string;

  @ApiProperty()
  textSize: number;

  @ApiProperty()
  textFont: string;

  @ApiProperty({ isArray: true, enum: themes })
  themes: string[];

  @ApiProperty({ isArray: true, enum: interactions })
  interactions: string[];

  @ApiProperty()
  isRecorded: boolean;

  @ApiProperty({ nullable: true, type: 'string' })
  audioUrl: string | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  inspirationId: string;

  @ApiProperty()
  authorId: string;

  @ApiProperty({ description: '로그인한 사용자가 스크랩한 시인지 여부' })
  isScrapped: boolean;
}
