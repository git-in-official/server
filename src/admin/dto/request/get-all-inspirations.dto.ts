import { Transform } from 'class-transformer';
import { IsEnum } from 'class-validator';

export class GetAllInspirationsDto {
  @Transform(({ value }) => value.toUpperCase())
  @IsEnum(['TITLE', 'WORD', 'AUDIO', 'VIDEO'])
  type: 'TITLE' | 'WORD' | 'AUDIO' | 'VIDEO';
}
