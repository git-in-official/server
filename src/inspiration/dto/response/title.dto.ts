import { ApiProperty } from '@nestjs/swagger';

export class TitleDto {
  @ApiProperty()
  title: string;
}
