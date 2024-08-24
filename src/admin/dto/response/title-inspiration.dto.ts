import { ApiProperty } from '@nestjs/swagger';

export class TitleInspirationDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;
}
