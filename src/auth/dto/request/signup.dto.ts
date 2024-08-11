import { LoginDto } from './login.dto';
import { IsString, Matches, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignupDto extends LoginDto {
  @ApiProperty({
    description:
      '닉네임: 한글,영어,숫자,밑줄,하이픈,공백금지,2글자이상 14글자이하',
  })
  @IsString()
  @Matches(/^[가-힣a-zA-Z0-9_-]+$/, {
    message: '닉네임은 한글, 영어, 숫자, 밑줄, 하이픈만 허용됩니다.',
  })
  @Length(2, 14, { message: '닉네임은 2글자 이상 14글자 이하이어야 합니다.' })
  name: string;
}
