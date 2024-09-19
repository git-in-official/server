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
  async getTitle(date: Date = new Date()) {
    const titles = await this.inspirationRepository.findAllTitles();
    const length = titles.length;
    const dateString = date.toISOString().split('T')[0];

    if (length === 0) {
      throw new Error('no inspiration');
    }

    const index = this.getHashedIndex(dateString, length);
    return {
      id: titles[index].id,
      text: titles[index].displayName,
    };
  }

  async getWord(date: Date = new Date()) {
    const words = await this.inspirationRepository.findAllWords();
    const length = words.length;
    const dateString = date.toISOString().split('T')[0];

    if (length === 0) {
      throw new Error('no inspiration');
    }

    const index = this.getHashedIndex(dateString, length);
    return {
      id: words[index].id,
      text: words[index].displayName,
    };
  }

  async getAudio(date: Date = new Date()) {
    const audios = await this.inspirationRepository.findAllAudios();
    const length = audios.length;
    const dateString = date.toISOString().split('T')[0];

    if (length === 0) {
      throw new Error('no inspiration');
    }

    const index = this.getHashedIndex(dateString, length);
    return {
      id: audios[index].id,
      filename: audios[index].displayName,
      fileUrl:
        this.awsService.getAudioInspirationUrl() + audios[index].displayName,
    };
  }

  async getVideo(date: Date = new Date()) {
    const videos = await this.inspirationRepository.findAllVideos();
    const length = videos.length;
    const dateString = date.toISOString().split('T')[0];

    if (length === 0) {
      throw new Error('no inspiration');
    }

    const index = this.getHashedIndex(dateString, length);
    return {
      id: videos[index].id,
      filename: videos[index].displayName,
      fileUrl:
        this.awsService.getVideoInspirationUrl() + videos[index].displayName,
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

  async getAllTitles() {
    const titles = await this.inspirationRepository.findAllTitles();
    return titles.map((title) => {
      return {
        id: title.id,
        text: title.displayName,
      };
    });
  }

  async getAllWords() {
    const words = await this.inspirationRepository.findAllWords();
    return words.map((word) => {
      return {
        id: word.id,
        text: word.displayName,
      };
    });
  }

  async getAllAudios() {
    const audios = await this.inspirationRepository.findAllAudios();
    return audios.map((audio) => ({
      id: audio.id,
      filename: audio.displayName,
      fileUrl: this.awsService.getAudioInspirationUrl() + audio.displayName,
    }));
  }

  async getAllVideos() {
    const videos = await this.inspirationRepository.findAllVideos();
    return videos.map((video) => ({
      id: video.id,
      filename: video.displayName,
      fileUrl: this.awsService.getVideoInspirationUrl() + video.displayName,
    }));
  }
}
