import { Module } from "@nestjs/common";
import { EmotionController } from "./emotion.controller";
import { EmotionService } from "./emotion.service";

@Module({
    providers: [EmotionService],
    controllers: [EmotionController],
})

export class EmotionModule {}