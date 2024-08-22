import { Injectable, Inject } from '@nestjs/common';
import { PoemRepository } from './poem.repository';
import { LlmService } from './llm.service';
import { AwsService } from '../aws/aws.service';
import { ScrapRepository } from './scrap.repository';

@Injectable()
export class PoemService {
  constructor(
    @Inject(PoemRepository) private readonly poemRepository: PoemRepository,
    @Inject(ScrapRepository) private readonly scrapRepository: ScrapRepository,
    private readonly awsService: AwsService,
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

  async scrap(poemId: string, userId: string) {
    const scrap = await this.scrapRepository.findOneByPoemIdAndUserId(
      poemId,
      userId,
    );
    return scrap
      ? await this.unScrap(scrap.id)
      : await this.doScrap(poemId, userId);
  }

  async doScrap(poemId: string, userId: string) {
    await this.scrapRepository.create(poemId, userId);
  }

  async unScrap(id: string) {
    await this.scrapRepository.delete(id);
  }

  async canWrite(userId: string) {
    const count = await this.poemRepository.countUserDaily(userId);
    if (count < 2) {
      return true;
    } else {
      return false;
    }
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
