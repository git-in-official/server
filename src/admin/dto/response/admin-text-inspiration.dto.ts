import { ApiProperty } from '@nestjs/swagger';

export class AdminTextInspirationDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  text: string;
}
