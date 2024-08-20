import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString, IsEnum } from 'class-validator';
import { themes, interactions } from 'src/constants/tags';

export class UpdateTagDto {
  @ApiProperty()
  @IsString()
  readonly title: string;

  @ApiProperty()
  @IsArray()
  @IsEnum(themes, { each: true })
  readonly beforeThemes: string[];

  @ApiProperty()
  @IsArray()
  @IsEnum(interactions, { each: true })
  readonly beforeInteractions: string[];

  @ApiProperty()
  @IsArray()
  @IsEnum(themes, { each: true })
  readonly afterThemes: string[];

  @ApiProperty()
  @IsArray()
  @IsEnum(interactions, { each: true })
  readonly afterInteractions: string[];

  @ApiProperty()
  @IsString()
  readonly content: string;
}
