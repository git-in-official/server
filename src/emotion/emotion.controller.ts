import { Controller, Get, Param, Post, Body, UseGuards } from "@nestjs/common";
import { EmotionService } from "./emotion.service";
import {ApiTags, ApiOperation, ApiParam, ApiBearerAuth} from '@nestjs/swagger';
import { JwtGuard } from "src/auth/guards";

@ApiTags('emotion')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('emotion')
export class EmotionController {
    constructor(private readonly emotionService: EmotionService) {}

    @Get()
    @ApiOperation({summary: '모드 감정 목록 조회'})
    findAll() {
        return this.emotionService.findAll();
    }
    @Get(':emotion')
    @ApiOperation({summary: '특정 감정 조회'})
    @ApiParam({name: 'emotion', example: '기쁨, 슬픔, 분노 등', type: String, description: '감정 이름'})
    findOne(@Param('emotion') emotion: string) {
        return this.emotionService.findOne(emotion);
    }
}