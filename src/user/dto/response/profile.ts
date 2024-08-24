import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class Achievement {
  @ApiProperty()
  readonly id: string;

  @ApiProperty()
  readonly name: string;

  @ApiProperty()
  readonly icon: string;

  @ApiProperty()
  readonly description: string;
}

class ScrapUser {
  @ApiProperty()
  readonly id: string;

  @ApiProperty()
  readonly name: string;

  @ApiProperty({
    type: 'string',
    nullable: true,
    description: '대표 업적 icon URL',
  })
  readonly icon?: string | null;

  @ApiProperty()
  readonly count: number;
}

export class ProfileDto {
  @ApiProperty()
  readonly id: string;

  @ApiProperty()
  readonly name: string;

  @ApiProperty()
  readonly ink: number;

  @ApiProperty({ type: 'string', nullable: true })
  @ApiPropertyOptional()
  readonly introduction?: string | null;

  @ApiProperty({ type: Achievement, nullable: true })
  @ApiPropertyOptional()
  readonly mainAchievement?: Achievement | null;

  @ApiProperty({ isArray: true, type: Achievement })
  readonly achievements: Achievement[];

  @ApiProperty({ isArray: true, type: ScrapUser })
  readonly scrapUsers: ScrapUser[];
}
