import { ApiProperty } from '@nestjs/swagger';

export class AdminFileInspirationDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  filename: string;

  @ApiProperty()
  fileUrl: string;
}
