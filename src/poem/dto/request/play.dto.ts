import { IsUUID } from 'class-validator';

export class PlayDto {
  @IsUUID()
  id: string;
}
