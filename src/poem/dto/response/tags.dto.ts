import { ApiProperty } from '@nestjs/swagger';

export class TagsDto {
  @ApiProperty()
  themes: string[];

  @ApiProperty()
  interactions: string[];
}
