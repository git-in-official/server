import { ApiProperty } from '@nestjs/swagger';
import { AchievementName } from '../../types';

export class AchievementsDto {
  @ApiProperty()
  readonly id: string;

  @ApiProperty({
    enum: ['SCRAPKING', 'SCRAPQUEEN'],
    description: '칭호 명은 임시',
  })
  readonly name: AchievementName;

  @ApiProperty({ description: '아이콘 URL' })
  readonly icon: string;

  @ApiProperty({ description: '획득 여부' })
  readonly isAquired: boolean;
}
