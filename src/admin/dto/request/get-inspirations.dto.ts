import { Transform } from 'class-transformer';
import { IsEnum } from 'class-validator';

export class GetInspirationsDto {
  @Transform(({ value }) => value.toUpperCase())
  @IsEnum(['TITLE', 'WORD', 'AUDIO', 'VIDEO'])
  type: string;
}
