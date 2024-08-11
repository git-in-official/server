import { ApiProperty } from '@nestjs/swagger';

export class WordDto {
  @ApiProperty()
  word: string;
}
