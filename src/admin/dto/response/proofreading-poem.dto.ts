import { ApiProperty, getSchemaPath, ApiExtraModels } from '@nestjs/swagger';
import { themes, interactions } from 'src/constants/tags';

export class BaseInspirationDto {
  @ApiProperty()
  readonly id: string;

  @ApiProperty()
  readonly displayName: string;

  @ApiProperty()
  readonly type: string;
}

export class TextInspirationDto extends BaseInspirationDto {
  @ApiProperty({ enum: ['TITLE', 'WORD'] })
  readonly type: 'TITLE' | 'WORD';
}

export class AudioInspirationDto extends BaseInspirationDto {
  @ApiProperty()
  readonly type: 'AUDIO';

  @ApiProperty()
  readonly audioUrl: string;
}

export class VideoInspirationDto extends BaseInspirationDto {
  @ApiProperty()
  readonly type: 'VIDEO';

  @ApiProperty()
  readonly videoUrl: string;
}

@ApiExtraModels(TextInspirationDto, AudioInspirationDto, VideoInspirationDto)
export class ProofreadingPoemDetailDto {
  @ApiProperty()
  readonly id: string;

  @ApiProperty()
  readonly title: string;

  @ApiProperty()
  readonly content: string;

  @ApiProperty()
  readonly textAlign: string;

  @ApiProperty()
  readonly textSize: number;

  @ApiProperty()
  readonly textFont: string;

  @ApiProperty({ isArray: true, enum: themes })
  readonly themes: string[];

  @ApiProperty({ isArray: true, enum: interactions })
  readonly interactions: string[];

  @ApiProperty()
  readonly isRecorded: boolean;

  @ApiProperty({ required: false })
  readonly audioUrl?: string;

  @ApiProperty()
  readonly status: '교정중';

  @ApiProperty({ type: 'string', nullable: true })
  readonly originalContent: string | null;

  @ApiProperty({ type: 'string', nullable: true })
  readonly originalTitle: string | null;

  @ApiProperty({ description: 'ISO 8601' })
  readonly createdAt: Date;

  @ApiProperty({
    oneOf: [
      { $ref: getSchemaPath(TextInspirationDto) },
      { $ref: getSchemaPath(AudioInspirationDto) },
      { $ref: getSchemaPath(VideoInspirationDto) },
    ],
    discriminator: { propertyName: 'type' },
  })
  readonly inspiration:
    | TextInspirationDto
    | AudioInspirationDto
    | VideoInspirationDto;

  @ApiProperty()
  readonly authorId: string;
}
