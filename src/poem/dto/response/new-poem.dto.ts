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

  @ApiProperty()
  isPublished: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  authorId: string;
}
