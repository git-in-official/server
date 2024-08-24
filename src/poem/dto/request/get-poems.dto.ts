import { IsString, IsNumber, IsOptional } from 'class-validator';

export class GetPoemsDto {
  @IsOptional()
  @IsString()
  readonly emotion?: string;

  @IsNumber()
  readonly index: number;
}
