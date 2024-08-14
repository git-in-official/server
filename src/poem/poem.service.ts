import { Injectable } from '@nestjs/common';
import { PoemRepository } from './poem.repository';
import { AwsService } from 'src/aws/aws.service';
import { LlmService } from './llm.service';

@Injectable()
export class PoemService {
  constructor(
    private readonly awsService: AwsService,
    private readonly poemRepository: PoemRepository,
    private readonly llmService: LlmService,
  ) {}
  async analysisPoem(title: string, content: string) {
    return await this.llmService.analyzePoem(title, content);
  }

  async changeEmotion(changeTagInput: ChangeTagInput) {
    return await this.llmService.changeTag(changeTagInput);
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
