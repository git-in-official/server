import { ApiProperty, ApiExtraModels } from '@nestjs/swagger';

export class FileInspirationDto {
  @ApiProperty()
  readonly id: string;
  @ApiProperty()
  readonly filename: string;
  @ApiProperty()
  readonly fileUrl: string;
}
