import { ApiProperty } from '@nestjs/swagger';

export class JwtDto {
  @ApiProperty()
  readonly accessToken: string;

  @ApiProperty()
  readonly name: string;
}
