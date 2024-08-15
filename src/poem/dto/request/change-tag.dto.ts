import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export class UpdateTagDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  beforeThemes: string[];

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  beforeInteractions: string[];

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  afterThemes: string[];

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  afterInteractions: string[];

  @ApiProperty()
  @IsString()
  content: string;
}
