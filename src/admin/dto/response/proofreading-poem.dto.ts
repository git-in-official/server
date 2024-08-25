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
export class ProofreadingPoemDto {
  @ApiProperty()
  readonly id: string;

  @ApiProperty()
  readonly title: string;

  @ApiProperty()
  readonly authorName: string;

  @ApiProperty({ isArray: true, enum: themes })
  readonly themes: string[];

  @ApiProperty({ isArray: true, enum: interactions })
  readonly interactions: string[];

  @ApiProperty()
  readonly isRecorded: boolean;

  @ApiProperty()
  readonly createdAt: Date;

  @ApiProperty()
  readonly status: string;

  @ApiProperty()
  readonly content: string;

  @ApiProperty({ nullable: true })
  readonly audioUrl: string | null;

  @ApiProperty({
    oneOf: [
      { $ref: getSchemaPath(TitleInspirationDto) },
      { $ref: getSchemaPath(WordInspirationDto) },
      { $ref: getSchemaPath(AudioInspirationDto) },
      { $ref: getSchemaPath(VideoInspirationDto) },
    ],
  })
  readonly inspiration:
    | TitleInspirationDto
    | WordInspirationDto
    | AudioInspirationDto
    | VideoInspirationDto;
}
