import { Injectable } from '@nestjs/common';
import { PoemRepository } from './poem.repository';
import { AwsService } from 'src/aws/aws.service';

@Injectable()
export class PoemService {
  constructor(
    private readonly awsService: AwsService,
    private readonly poemRepository: PoemRepository,
  ) {}
  async analysisPoem(title: string, content: string) {
    // 시 태그 분석 로직
    title;
    content;
    return {
      themes: ['테마1', '테마2'],
      interactions: ['상호작용1', '상호작용2'],
    };
  }

  async changeEmotion(changeTagInput: ChangeTagInput) {
    // 감정 수정 로직
    changeTagInput;

    return {
      content: '감정에 맞춰 수정된 시 입니다.\n' + changeTagInput.content,
    };
  }

  async createPoem(userId: string, createPoemInput: CreatePoemInput) {
    const poemData = {
      title: createPoemInput.title,
      content: createPoemInput.content,
      themes: createPoemInput.themes,
      interactions: createPoemInput.interactions,
      textAlign: createPoemInput.textAlign,
      textSize: createPoemInput.textSize,
      textFont: createPoemInput.textFont,
      isRecorded: createPoemInput.audioFile ? true : false,
      originalContent: createPoemInput.originalContent ?? null,
      status: '교정중',
    };

    const newPoem = await this.poemRepository.createPoem(userId, poemData);

    if (createPoemInput.audioFile) {
      await this.awsService.uploadPoemRecord(
        newPoem.id,
        createPoemInput.audioFile,
      );
      return {
        ...newPoem,
        audioUrl: this.awsService.getAudioUrl() + newPoem.id,
      };
    }
    return newPoem;
  }
}

export type CreatePoemInput = {
  title: string;
  content: string;
  themes: string[];
  interactions: string[];
  textAlign: string;
  textSize: number;
  textFont: string;
  originalContent?: string;
  audioFile?: Express.Multer.File;
};

export type ChangeTagInput = {
  title: string;
  beforeThemes: string[];
  beforeInteractions: string[];
  afterThemes: string[];
  afterInteractions: string[];
  content: string;
};
