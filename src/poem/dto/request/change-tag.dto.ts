import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export class UpdateTagDto {
  @ApiProperty()
  @IsString()
  readonly title: string;

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  readonly beforeThemes: string[];

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  readonly beforeInteractions: string[];

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  readonly afterThemes: string[];

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  readonly afterInteractions: string[];

  @ApiProperty()
  @IsString()
  readonly content: string;
}
