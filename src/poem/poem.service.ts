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
      inspirationId: createInput.inspirationId,
      status: '교정중',
    };

    const newPoem = await this.poemRepository.create(userId, poemData);

    if (createInput.audioFile) {
      await this.awsService.uploadPoemAudio(newPoem.id, createInput.audioFile);
      return {
        ...newPoem,
        audioUrl: this.awsService.getPoemAudioUrl() + newPoem.id,
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

  async getProofreadingList() {
    return await this.poemRepository.findAllProofreading();
  }

  async getOneProofreading(id: string) {
    const poem = await this.poemRepository.findOneProofreading(id);
    if (!poem) {
      throw new Error('해당 시가 존재하지 않습니다.');
    }
    let inspirationData;
    if (poem.inspiration.type === 'AUDIO') {
      inspirationData = {
        ...poem.inspiration,
        audioUrl:
          this.awsService.getAudioInspirationUrl() +
          poem.inspiration.displayName,
      };
    } else if (poem.inspiration.type === 'VIDEO') {
      inspirationData = {
        ...poem.inspiration,
        videoUrl:
          this.awsService.getVideoInspirationUrl() +
          poem.inspiration.displayName,
      };
    } else {
      inspirationData = poem.inspiration;
    }
    if (poem.isRecorded) {
      return {
        ...poem,
        audioUrl: this.awsService.getPoemAudioUrl() + poem.id,
        inspiration: inspirationData,
      };
    }
    return {
      ...poem,
      inspiration: inspirationData,
    };
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
  inspirationId: string;
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
