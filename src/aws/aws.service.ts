import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AwsService {
  constructor(
    private readonly s3Client: S3Client,
    private readonly configService: ConfigService,
  ) {}

  async uploadPoemAudio(id: string, file: Express.Multer.File) {
    const command = new PutObjectCommand({
      Bucket: this.configService.get<string>('AWS_BUCKET_NAME'),
      Key: 'poems/audios/' + id,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    return this.s3Client.send(command);
  }

  getPoemAudioUrl() {
    return (
      this.configService.get<string>('AWS_CLOUDFRONT_URL') + '/poems/audios/'
    );
  }

  async uploadAudioInspiration(file: Express.Multer.File) {
    const command = new PutObjectCommand({
      Bucket: this.configService.get<string>('AWS_BUCKET_NAME'),
      Key: 'inspirations/audios/' + file.originalname,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    return this.s3Client.send(command);
  }

  async uploadVideoInspiration(file: Express.Multer.File) {
    const command = new PutObjectCommand({
      Bucket: this.configService.get<string>('AWS_BUCKET_NAME'),
      Key: 'inspirations/videos/' + file.originalname,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    return this.s3Client.send(command);
  }

  getAudioInspirationUrl() {
    return (
      this.configService.get<string>('AWS_CLOUDFRONT_URL') +
      '/inspirations/audios/'
    );
  }

  getVideoInspirationUrl() {
    return (
      this.configService.get<string>('AWS_CLOUDFRONT_URL') +
      '/inspirations/videos/'
    );
  }
}
