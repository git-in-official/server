import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { emotions } from 'src/constants/emotions';

const emotionList = emotions.map((item) => item.emotion);

export class EmotionSelectDto {
  @ApiProperty({
    enum: emotionList,
    description: '"모르겠음" 감정을 선택했을 땐 요청안하시면 됩니다.',
  })
  @IsEnum(emotionList)
  emotion: (typeof emotionList)[number];
}
