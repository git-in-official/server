import { ApiProperty, getSchemaPath, ApiExtraModels } from '@nestjs/swagger';
import { themes, interactions } from 'src/constants/tags';

class TitleInspirationDto {
  @ApiProperty()
  readonly id: string;

  @ApiProperty()
  readonly type: 'TITLE';

  @ApiProperty()
  readonly title: string;
}

class WordInspirationDto {
  @ApiProperty()
  readonly id: string;

  @ApiProperty()
  readonly type: 'WORD';

  @ApiProperty()
  readonly word: string;
}

class AudioInspirationDto {
  @ApiProperty()
  readonly id: string;

  @ApiProperty()
  readonly type: 'AUDIO';

  @ApiProperty()
  readonly filename: string;

  @ApiProperty()
  readonly audioUrl: string;
}

class VideoInspirationDto {
  @ApiProperty()
  readonly id: string;

  @ApiProperty()
  readonly type: 'VIDEO';

  @ApiProperty()
  readonly filename: string;

  @ApiProperty()
  readonly videoUrl: string;
}

@ApiExtraModels(
  TitleInspirationDto,
  WordInspirationDto,
  AudioInspirationDto,
  VideoInspirationDto,
)
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
  readonly status: string;

  @ApiProperty({ type: 'string', nullable: true })
  readonly originalContent: string | null;

  @ApiProperty({ type: 'string', nullable: true })
  readonly originalTitle: string | null;

  @ApiProperty({ description: 'ISO 8601' })
  readonly createdAt: Date;

  @ApiProperty({
    oneOf: [
      { $ref: getSchemaPath(TitleInspirationDto) },
      { $ref: getSchemaPath(WordInspirationDto) },
      { $ref: getSchemaPath(AudioInspirationDto) },
      { $ref: getSchemaPath(VideoInspirationDto) },
    ],
    discriminator: { propertyName: 'type' },
  })
  readonly inspiration:
    | TitleInspirationDto
    | WordInspirationDto
    | AudioInspirationDto
    | VideoInspirationDto;

  @ApiProperty()
  readonly authorId: string;
}
