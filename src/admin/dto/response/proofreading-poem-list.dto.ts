import { ApiProperty } from '@nestjs/swagger';

export class ProofreadingPoemDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;
}
