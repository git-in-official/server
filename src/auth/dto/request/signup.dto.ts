import { LoginDto } from './login.dto';
import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignupDto extends LoginDto {
  @ApiProperty({ description: '필명' })
  @IsString()
  name: string;
}
