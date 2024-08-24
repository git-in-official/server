import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, Length, minLength } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty()
  @IsString()
  @Length(2)
  readonly name: string;

  @ApiProperty({ type: 'string', nullable: true })
  @ApiPropertyOptional()
  @IsString()
  readonly introduction?: string | null;
}
