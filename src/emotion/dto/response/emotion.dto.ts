import { ApiProperty } from '@nestjs/swagger';

export class EmotionDto {
  @ApiProperty()
  readonly emotion: string;

  @ApiProperty()
  readonly description: string[];
}
