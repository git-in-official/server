import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

const typeList = ['TITLE', 'WORD', 'AUDIO', 'VIDEO'];

export class UploadInspirationDto {
  @ApiProperty({ enum: typeList, description: 'TITLE, WORD, AUDIO, VIDEO' })
  @Transform(({ value }) => value.toUpperCase())
  @IsEnum(typeList)
  readonly type: 'TITLE' | 'WORD' | 'AUDIO' | 'VIDEO';

  @ApiProperty({
    required: false,
    description: '타입이 TITLE, WORD일 경우에만 필수',
    type: String,
  })
  @IsOptional()
  @IsString()
  readonly text?: string | null;

  @ApiProperty({
    required: false,
    description: '타입이 AUDIO, VIDEO일 경우에만 필수',
    type: 'file',
  })
  readonly file?: Express.Multer.File | null;
}
