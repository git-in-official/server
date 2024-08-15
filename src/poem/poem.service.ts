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
  async analyzePoem(title: string, content: string) {
    return await this.llmService.analyzePoem(title, content);
  }

  async updateTag(updateTagInput: UpdateTagInput) {
    return await this.llmService.updateTag(updateTagInput);
  }

  async create(userId: string, createInput: CreateInput) {
    const poemData = {
      title: createInput.title,
      content: createInput.content,
      themes: createInput.themes,
      interactions: createInput.interactions,
      textAlign: createInput.textAlign,
      textSize: createInput.textSize,
      textFont: createInput.textFont,
      isRecorded: createInput.audioFile ? true : false,
      originalContent: createInput.originalContent ?? null,
      originalTitle: createInput.originalTitle ?? null,
      status: '교정중',
    };

    const newPoem = await this.poemRepository.create(userId, poemData);

    if (createInput.audioFile) {
      await this.awsService.uploadPoemAudio(newPoem.id, createInput.audioFile);
      return {
        ...newPoem,
        audioUrl: this.awsService.getAudioUrl() + newPoem.id,
      };
    }
    return newPoem;
  }
}

export type CreateInput = {
  title: string;
  content: string;
  themes: string[];
  interactions: string[];
  textAlign: string;
  textSize: number;
  textFont: string;
  originalContent?: string;
  originalTitle?: string;
  audioFile?: Express.Multer.File;
};

export type UpdateTagInput = {
  title: string;
  beforeThemes: string[];
  beforeInteractions: string[];
  afterThemes: string[];
  afterInteractions: string[];
  content: string;
};
