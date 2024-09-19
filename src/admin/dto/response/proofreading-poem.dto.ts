import { ApiProperty, getSchemaPath, ApiExtraModels } from '@nestjs/swagger';
import { themes, interactions } from 'src/constants/tags';

class TextInspirationWithTypeDto {
  @ApiProperty()
  readonly id: string;

  @ApiProperty()
  readonly type: string;

  @ApiProperty()
  readonly text: string;
}

class FileInspirationWithTypeDto {
  @ApiProperty()
  readonly id: string;

  @ApiProperty()
  readonly type: string;

  @ApiProperty()
  readonly filename: string;

  @ApiProperty()
  readonly fileUrl: string;
}

@ApiExtraModels(TextInspirationWithTypeDto, FileInspirationWithTypeDto)
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
      { $ref: getSchemaPath(TextInspirationWithTypeDto) },
      { $ref: getSchemaPath(FileInspirationWithTypeDto) },
    ],
  })
  readonly inspiration: TextInspirationWithTypeDto | FileInspirationWithTypeDto;
}
