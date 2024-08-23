import { ApiProperty } from '@nestjs/swagger';

export class NewPoemDto {
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

  @ApiProperty()
  readonly themes: string[];

  @ApiProperty()
  readonly interactions: string[];

  @ApiProperty()
  readonly isRecorded: boolean;

  @ApiProperty({ enum: ['교정중', '교열', '인쇄', '출판'] })
  readonly status: string;

  @ApiProperty({ description: 'ISO 8601' })
  readonly createdAt: Date;

  @ApiProperty()
  readonly authorId: string;

  @ApiProperty({ description: '글감 ID' })
  readonly inspirationId: string;

  @ApiProperty({ description: '녹음 파일 URL', required: false })
  readonly audioUrl?: string;
}
