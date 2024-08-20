import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum } from 'class-validator';
import { themes, interactions } from 'src/constants/tags';

export class UpdateTagDto {
  @ApiProperty()
  @IsString()
  readonly title: string;

  @ApiProperty({ enum: themes })
  @IsEnum(themes, { each: true })
  readonly beforeThemes: string[];

  @ApiProperty({ enum: interactions })
  @IsEnum(interactions, { each: true })
  readonly beforeInteractions: string[];

  @ApiProperty({ enum: themes })
  @IsEnum(themes, { each: true })
  readonly afterThemes: string[];

  @ApiProperty({ enum: interactions })
  @IsEnum(interactions, { each: true })
  readonly afterInteractions: string[];

  @ApiProperty()
  @IsString()
  readonly content: string;
}
