import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export class ChangeEmotionDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  beforeEmotion: string[];

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  afterEmotion: string[];

  @ApiProperty()
  @IsString()
  content: string;
}
