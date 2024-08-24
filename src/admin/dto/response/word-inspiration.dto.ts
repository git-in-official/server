import { ApiProperty } from '@nestjs/swagger';

export class WordInspirationDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  word: string;
}
