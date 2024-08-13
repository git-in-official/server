import { ApiProperty } from '@nestjs/swagger';

export class NewPoemDto {
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

  @ApiProperty()
  themes: string[];

  @ApiProperty()
  interactions: string[];

  @ApiProperty()
  isRecorded: boolean;

  @ApiProperty({ enum: ['교정중', '교열', '인쇄', '출판'] })
  status: string;

  @ApiProperty({ description: 'ISO 8601' })
  createdAt: Date;

  @ApiProperty()
  authorId: string;

  @ApiProperty({ description: '녹음 파일 URL', required: false })
  audioUrl?: string;
}
