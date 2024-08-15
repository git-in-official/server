import { ApiProperty } from '@nestjs/swagger';

export class TagsDto {
  @ApiProperty()
  readonly themes: string[];

  @ApiProperty()
  readonly interactions: string[];
}
