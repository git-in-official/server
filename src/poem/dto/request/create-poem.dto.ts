import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString, IsNumber, IsOptional } from 'class-validator';

export class CreatePoemDto {
  @ApiProperty()
  @IsString()
  readonly title: string;

  @ApiProperty()
  @IsString()
  readonly content: string;

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  readonly themes: string[];

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  readonly interactions: string[];

  @ApiProperty()
  @IsString()
  readonly textAlign: string;

  @ApiProperty({ type: 'number' })
  @IsNumber()
  readonly textSize: number;

  @ApiProperty()
  @IsString()
  readonly textFont: string;

  @ApiProperty({
    description: 'AI가 수정하기 전의 원본 시 내용',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  readonly originalContent?: string;

  @ApiProperty({
    description: 'AI가 수정하기 전의 원본 시 제목',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  readonly originalTitle?: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
    nullable: true,
  })
  readonly audioFile?: Express.Multer.File;
}
