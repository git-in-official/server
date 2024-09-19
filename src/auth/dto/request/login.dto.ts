import { IsString, IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ enum: ['GOOGLE'] })
  @Transform(({ value }) => value.toUpperCase())
  @IsEnum(['GOOGLE'])
  readonly provider: 'GOOGLE';

  @ApiProperty()
  @IsString()
  readonly providerAccessToken: string;
}
