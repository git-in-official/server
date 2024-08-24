import { ApiProperty, getSchemaPath, ApiExtraModels } from '@nestjs/swagger';
import { themes, interactions } from 'src/constants/tags';

export class BaseInspirationDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  displayName: string;

  @ApiProperty()
  type: string;
}

export class TextInspirationDto extends BaseInspirationDto {
  @ApiProperty({ enum: ['TITLE', 'WORD'] })
  type: 'TITLE' | 'WORD';
}

export class AudioInspirationDto extends BaseInspirationDto {
  @ApiProperty()
  type: 'AUDIO';

  @ApiProperty()
  audioUrl: string;
}

export class VideoInspirationDto extends BaseInspirationDto {
  @ApiProperty()
  type: 'VIDEO';

  @ApiProperty()
  videoUrl: string;
}

@ApiExtraModels(TextInspirationDto, AudioInspirationDto, VideoInspirationDto)
export class ProofreadingPoemDetailDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  textAlign: string;

  @ApiProperty()
  textSize: number;

  @ApiProperty()
  textFont: string;

  @ApiProperty({ isArray: true, enum: themes })
  themes: string[];

  @ApiProperty({ isArray: true, enum: interactions })
  interactions: string[];

  @ApiProperty()
  isRecorded: boolean;

  @ApiProperty({ required: false })
  audioUrl?: string;

  @ApiProperty()
  status: '교정중';

  @ApiProperty({ type: 'string', nullable: true })
  originalContent: string | null;

  @ApiProperty({ type: 'string', nullable: true })
  originalTitle: string | null;

  @ApiProperty({ description: 'ISO 8601' })
  createdAt: Date;

  @ApiProperty({
    oneOf: [
      { $ref: getSchemaPath(TextInspirationDto) },
      { $ref: getSchemaPath(AudioInspirationDto) },
      { $ref: getSchemaPath(VideoInspirationDto) },
    ],
    discriminator: { propertyName: 'type' },
  })
  inspiration: TextInspirationDto | AudioInspirationDto | VideoInspirationDto;

  @ApiProperty()
  authorId: string;
}
