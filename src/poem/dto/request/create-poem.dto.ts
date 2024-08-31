import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsString,
  IsNumber,
  IsOptional,
  IsNotEmpty,
  IsUUID,
} from 'class-validator';

export class CreatePoemDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
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
  @IsNotEmpty()
  readonly textAlign: string;

  @ApiProperty({ type: 'number' })
  @IsNumber()
  readonly textSize: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
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

  @ApiProperty({ description: '글감의 ID' })
  @IsNotEmpty()
  @IsUUID()
  readonly inspirationId: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
    nullable: true,
  })
  readonly audioFile?: Express.Multer.File;
}
