import { ApiProperty } from '@nestjs/swagger';

export class TitleDto {
  @ApiProperty()
  readonly title: string;
}
