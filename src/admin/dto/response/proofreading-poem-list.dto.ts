import { ApiProperty } from '@nestjs/swagger';

export class ProofreadingPoemDto {
  @ApiProperty()
  readonly id: string;

  @ApiProperty()
  readonly title: string;
}
