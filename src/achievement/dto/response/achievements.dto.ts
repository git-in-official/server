import { ApiProperty } from '@nestjs/swagger';

export class AchievementsDto {
  @ApiProperty()
  readonly id: string;

  @ApiProperty()
  readonly name: string;

  @ApiProperty({ description: '아이콘 URL' })
  readonly icon: string;

  @ApiProperty({ description: '획득 조건' })
  readonly descrption: string;

  @ApiProperty({ description: '획득 여부' })
  readonly isAquired: boolean;
}
