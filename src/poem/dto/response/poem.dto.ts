import { ApiProperty } from '@nestjs/swagger';
import { themes, interactions } from 'src/constants/tags';
export class Author {
  @ApiProperty()
  readonly id: string;

  @ApiProperty()
  readonly name: string;
}

export class PoemDto {
  @ApiProperty()
  readonly id: string;

  @ApiProperty()
  readonly title: string;

  @ApiProperty()
  readonly content: string;

  @ApiProperty()
  readonly textAlign: string;

  @ApiProperty()
  readonly textSize: number;

  @ApiProperty()
  readonly textFont: string;

  @ApiProperty({ isArray: true, enum: themes })
  readonly themes: string[];

  @ApiProperty({ isArray: true, enum: interactions })
  readonly interactions: string[];

  @ApiProperty()
  readonly isRecorded: boolean;

  @ApiProperty({ nullable: true, type: 'string' })
  readonly audioUrl: string | null;

  @ApiProperty()
  readonly createdAt: Date;

  @ApiProperty()
  readonly inspirationId: string;

  @ApiProperty()
  readonly author: Author;

  @ApiProperty({ description: '로그인한 사용자가 스크랩한 시인지 여부' })
  readonly isScrapped: boolean;
}
