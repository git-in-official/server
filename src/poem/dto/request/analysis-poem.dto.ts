import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AnalyzePoemDto {
  @ApiProperty()
  @IsString()
  readonly title: string;

  @ApiProperty()
  @IsString()
  readonly content: string;
}
