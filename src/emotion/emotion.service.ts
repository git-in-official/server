import { Injectable } from "@nestjs/common";
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class EmotionService {
    private emotion : any[];

    constructor() {
        // 프로젝트 루트 디렉터리 기준으로 JSON 파일 경로 설정
        const filePath = path.join(__dirname, '../../src/emotion/emotion.json');
        const jsonData = fs.readFileSync(filePath, 'utf-8');
        this.emotion = JSON.parse(jsonData);
    }

    findAll() {
        return this.emotion;
    }

    findOne(emotion: string) {
        return this.emotion.find(e => e.emotion === emotion);
    }
}