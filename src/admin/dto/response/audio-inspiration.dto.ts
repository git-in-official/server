import { ApiProperty } from '@nestjs/swagger';

export class AudioInspirationDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  type: string;

  @ApiProperty()
  filename: string;

  @ApiProperty()
  audioUrl: string;
}
