import { IsNumber, IsOptional, IsEnum } from 'class-validator';
import { emotions } from 'src/constants/emotions';

export class GetPoemsDto {
  @IsOptional()
  @IsEnum(emotions.map((emotion) => emotion.emotion))
  readonly emotion?: (typeof emotions)[number]['emotion'];

  @IsNumber()
  readonly index: number;
}
