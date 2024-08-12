import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AwsService {
  constructor(
    private readonly s3Client: S3Client,
    private readonly configService: ConfigService,
  ) {}

  async uploadPoemRecord(id: string, file: Express.Multer.File) {
    const command = new PutObjectCommand({
      Bucket: this.configService.get<string>('AWS_BUCKET_NAME'),
      Key: 'poems/records/' + id,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    return this.s3Client.send(command);
  }
}
