import { IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetInspirationQueryDto {
  @Transform(({ value }) => value.toUpperCase())
  @IsEnum(['WORD', 'TITLE', 'AUDIO', 'VIDEO'])
  type: string;
}
