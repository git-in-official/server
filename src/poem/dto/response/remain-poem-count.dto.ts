import { ApiProperty } from '@nestjs/swagger';

export class RemainPoemCountDto {
  @ApiProperty({
    description: '몇 개의 시를 더 쓸 수 있는지 나타냄',
    enum: [0, 1, 2],
  })
  readonly count: number;
}
