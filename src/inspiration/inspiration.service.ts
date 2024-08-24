import { Injectable, Inject } from '@nestjs/common';
import { InspirationRepository } from './inspiration.repository';
import { AwsService } from 'src/aws/aws.service';

@Injectable()
export class InspirationService {
  constructor(
    @Inject(InspirationRepository)
    private readonly inspirationRepository: InspirationRepository,
    private readonly awsService: AwsService,
  ) {}
  async getTitle(today: Date) {
    const titles = await this.inspirationRepository.findAllTitles();
    const length = titles.length;
    const dateString = today.toISOString().split('T')[0];

    if (length === 0) {
      throw new Error('no inspiration');
    }

    const index = this.getHashedIndex(dateString, length);
    return {
      id: titles[index].id,
      title: titles[index].title,
    };
  }

  async getWord(date: Date) {
    const words = await this.inspirationRepository.findAllWords();
    const length = words.length;
    const dateString = date.toISOString().split('T')[0];

    if (length === 0) {
      throw new Error('no inspiration');
    }

    const index = this.getHashedIndex(dateString, length);
    return {
      id: words[index].id,
      word: words[index].word,
    };
  }

  async getAudio(date: Date) {
    const audios = await this.inspirationRepository.findAllAudios();
    const length = audios.length;
    const dateString = date.toISOString().split('T')[0];

    if (length === 0) {
      throw new Error('no inspiration');
    }

    const index = this.getHashedIndex(dateString, length);
    return {
      id: audios[index].id,
      filename: audios[index].filename,
      audioUrl:
        this.awsService.getAudioInspirationUrl() + audios[index].filename,
    };
  }

  async getVideo(date: Date) {
    const videos = await this.inspirationRepository.findAllVideos();
    const length = videos.length;
    const dateString = date.toISOString().split('T')[0];

    if (length === 0) {
      throw new Error('no inspiration');
    }

    const index = this.getHashedIndex(dateString, length);
    return {
      id: videos[index].id,
      filename: videos[index].filename,
      videoUrl:
        this.awsService.getVideoInspirationUrl() + videos[index].filename,
    };
  }

  // range가 10이면 0~9까지의 숫자를 반환
  getHashedIndex(dateString: string, range: number) {
    let hash = 0;
    for (let i = 0; i < dateString.length; i++) {
      hash = dateString.charCodeAt(i) + ((hash << 5) - hash);
      hash = hash & hash; // 32비트 정수로 유지
    }
    return Math.abs(hash) % range;
  }

  async createTitle(title: string) {
    await this.inspirationRepository.createTitle(title);
    return;
  }

  async createWord(word: string) {
    await this.inspirationRepository.createWord(word);
    return;
  }

  async createAudio(file: Express.Multer.File) {
    await this.awsService.uploadAudioInspiration(file);
    await this.inspirationRepository.createAudio(file.originalname);
    return;
  }

  async createVideo(file: Express.Multer.File) {
    await this.awsService.uploadVideoInspiration(file);
    await this.inspirationRepository.createVideo(file.originalname);
    return;
  }
}
