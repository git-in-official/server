import { ApiProperty } from '@nestjs/swagger';

export class EmotionDto {
  @ApiProperty()
  emotion: string;

  @ApiProperty()
  description: string[];
}
