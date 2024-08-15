import { IsString, IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ enum: ['GOOGLE', 'APPLE'] })
  @Transform(({ value }) => value.toUpperCase())
  @IsEnum(['GOOGLE', 'APPLE'])
  readonly provider: 'GOOGLE' | 'APPLE';

  @ApiProperty()
  @IsString()
  readonly providerAccessToken: string;
}
