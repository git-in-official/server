import { ApiProperty } from '@nestjs/swagger';

export class ContentDto {
  @ApiProperty()
  readonly content: string;
}
