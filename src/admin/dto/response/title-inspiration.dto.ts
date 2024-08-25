import { ApiProperty } from '@nestjs/swagger';

export class TitleInspirationDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  type: string;

  @ApiProperty()
  title: string;
}
