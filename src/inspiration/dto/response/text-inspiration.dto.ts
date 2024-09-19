import { ApiProperty, ApiExtraModels } from '@nestjs/swagger';

export class TextInspirationDto {
  @ApiProperty()
  readonly id: string;
  @ApiProperty()
  readonly text: string;
}
