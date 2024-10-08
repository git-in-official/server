import { Injectable, Inject } from '@nestjs/common';
import { PoemRepository } from './poem.repository';
import { LlmService } from './llm.service';
import { AwsService } from '../aws/aws.service';
import { ScrapRepository } from './scrap.repository';
import { TagService } from 'src/tag/tag.service';
import { emotions } from 'src/constants/emotions';
import { AchievementRepository } from 'src/achievement/achievement.repository';

@Injectable()
export class PoemService {
  constructor(
    @Inject(PoemRepository) private readonly poemRepository: PoemRepository,
    @Inject(ScrapRepository) private readonly scrapRepository: ScrapRepository,
    @Inject(AchievementRepository)
    private readonly achievementRepository: AchievementRepository,
    private readonly awsService: AwsService,
    private readonly llmService: LlmService,
    private readonly tagService: TagService,
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
    }
    return await this.getRemain(userId);
  }

  async scrap(poemId: string, userId: string) {
    await this.getPoemOrThrow(poemId);
    const scrap = await this.scrapRepository.findOneByPoemIdAndUserId(
      poemId,
      userId,
    );

    return scrap
      ? await this.unScrap(poemId, scrap.id)
      : await this.doScrap(poemId, userId);
  }

  async doScrap(poemId: string, userId: string) {
    // Transaction
    await this.scrapRepository.create(poemId, userId);
    const poemScrapcount = await this.poemRepository.increaseScrapCount(poemId);
    const userScrapCount = await this.scrapRepository.countByUserId(userId);

    if (poemScrapcount >= 10) {
      const poem = await this.getPoemOrThrow(poemId);
      await this.achievementRepository.acquire(poem.authorId, '별이 된 시');
    }

    if (userScrapCount >= 10) {
      await this.achievementRepository.acquire(
        userId,
        '열 번 찍어 넘어간 나무',
      );
    }
  }

  async unScrap(poemId: string, scrapId: string) {
    // Transaction
    await this.scrapRepository.delete(scrapId);
    await this.poemRepository.decreaseScrapCount(poemId);
  }

  private async getPoemOrThrow(poemId: string) {
    const poem = await this.poemRepository.findOneById(poemId);
    if (!poem) throw Error('poem not found');

    return poem;
  }

  async getRemain(userId: string) {
    const maximum = 10;
    const count = await this.poemRepository.countUserDaily(userId);
    console.log('userId', userId);
    console.log('count', maximum - count);
    return {
      count: maximum - count,
    };
  }

  async getProofreadingList() {
    const peomList = await this.poemRepository.findAllProofreading();
    return peomList.map((poem) => {
      const { inspiration, author, ...rest } = poem;
      let inspirationData;
      if (inspiration.type === 'TITLE') {
        inspirationData = {
          id: inspiration.id,
          type: inspiration.type,
          title: inspiration.displayName,
        };
      } else if (inspiration.type === 'WORD') {
        inspirationData = {
          id: inspiration.id,
          type: inspiration.type,
          word: inspiration.displayName,
        };
      } else if (inspiration.type === 'AUDIO') {
        inspirationData = {
          id: inspiration.id,
          type: inspiration.type,
          filename: inspiration.displayName,
          audioUrl:
            this.awsService.getAudioInspirationUrl() + inspiration.displayName,
        };
      } else {
        inspirationData = {
          id: inspiration.id,
          type: inspiration.type,
          filename: inspiration.displayName,
          videoUrl:
            this.awsService.getVideoInspirationUrl() + inspiration.displayName,
        };
      }
      return {
        ...rest,
        authorName: author.name,
        inspiration: inspirationData,
        audioUrl: rest.isRecorded
          ? this.awsService.getPoemAudioUrl() + rest.id
          : null,
      };
    });
  }

  // 첫 발자국 업적 획득 로직 포함
  async publish(id: string) {
    const toAddInk = 10;
    const { authorId } = await this.poemRepository.updateToPublishedStatus(
      id,
      toAddInk,
    );

    const publishedCount =
      await this.poemRepository.countPublishedByUserId(authorId);
    if (publishedCount === 1) {
      await this.achievementRepository.acquire(authorId, '첫 발자국');
    }
    return;
  }

  async getAllByEmotion(getPoemsInput: GetPoemsInput) {
    let poems;
    if (getPoemsInput.emotion) {
      const firstTags = this.tagService.getFirstTags(getPoemsInput.emotion);
      const secondTags = this.tagService.getSecondTags(getPoemsInput.emotion);
      const allTags = {
        themes: [...firstTags.themes, ...secondTags.themes],
        interactions: [...firstTags.interactions, ...secondTags.interactions],
      };
      poems = await this.poemRepository.findAllPublishedByTag({
        userId: getPoemsInput.userId,
        ...allTags,
      });
    } else {
      poems = await this.poemRepository.findAllPublished({
        userId: getPoemsInput.userId,
      });
    }

    return poems.map((poem) => {
      const { scraps, ...rest } = poem;
      return {
        ...rest,
        isScrapped: scraps.length > 0,
        audioUrl: rest.isRecorded
          ? this.awsService.getPoemAudioUrl() + rest.id
          : null,
      };
    });
  }

  async play(id: string) {
    const { authorId, playCount } =
      await this.poemRepository.increasePlayCount(id);
    if (playCount === 30) {
      await this.achievementRepository.acquire(authorId, '목소리의 주인공');
    }
    return;
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

export type GetPoemsInput = {
  userId: string;
  emotion?: (typeof emotions)[number]['emotion'];
};
