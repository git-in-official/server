import { ApiProperty } from '@nestjs/swagger';

export class WordInspirationDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  type: string;

  @ApiProperty()
  word: string;
}
