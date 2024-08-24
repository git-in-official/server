import { ApiProperty } from '@nestjs/swagger';

export class VideoInspirationDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  filename: string;

  @ApiProperty()
  videoUrl: string;
}
