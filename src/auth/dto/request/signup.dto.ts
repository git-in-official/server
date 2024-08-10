import { LoginDto } from './login.dto';
import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignupDto extends LoginDto {
  @ApiProperty()
  @IsString()
  name: string;
}
