import { ApiProperty } from '@nestjs/swagger';

export class WordDto {
  @ApiProperty()
  readonly word: string;
}
