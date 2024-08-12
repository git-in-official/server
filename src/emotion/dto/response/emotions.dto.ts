import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class EmotionsDto {
    @ApiProperty()
    @IsString()
    emotion: string;

    @ApiProperty()
    @IsString()
    description: string;
}