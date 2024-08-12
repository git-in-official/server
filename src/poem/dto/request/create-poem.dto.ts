import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString, IsNumber } from 'class-validator';

export class CreatePoemDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  content: string;

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  themes: string[];

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  interactions: string[];

  @ApiProperty()
  @IsString()
  textAlign: string;

  @ApiProperty({ type: 'number' })
  @IsNumber()
  textSize: number;

  @ApiProperty()
  @IsString()
  textFont: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
    nullable: true,
  })
  audioFile?: Express.Multer.File;
}
