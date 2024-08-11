import { ApiProperty } from '@nestjs/swagger';

export class EmotionsDto {
  @ApiProperty()
  emotions: string[];
}
