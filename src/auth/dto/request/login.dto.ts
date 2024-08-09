import { IsString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ enum: ['google', 'apple'] })
  @IsEnum(['google', 'apple'])
  provider: 'google' | 'apple';

  @ApiProperty()
  @IsString()
  accessToken: string;
}
