import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';

describe('Admin (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    prisma = moduleFixture.get<PrismaService>(PrismaService);

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await prisma.inspiration.deleteMany();
  });

  describe('POST /admin/inspirations - 글감 업로드', () => {
    it('제목 글감을 생성한다', async () => {
      // given
      const testData = {
        type: 'TITLE',
        text: 'test-title',
      };

      // when
      const { status } = await request(app.getHttpServer())
        .post('/admin/inspirations')
        .send(testData);

      // then
      expect(status).toBe(201);
      const titleInspiration = await prisma.inspiration.findFirst({
        where: { displayName: testData.text },
      });
      expect(titleInspiration?.displayName).toBe(testData.text);
    });

    it('단어 글감을 생성한다', async () => {
      // given
      const testData = {
        type: 'WORD',
        text: 'test-word',
      };

      // when
      const { status } = await request(app.getHttpServer())
        .post('/admin/inspirations')
        .send(testData);

      // then
      expect(status).toBe(201);
      const wordInspiration = await prisma.inspiration.findFirst({
        where: { displayName: testData.text },
      });
      expect(wordInspiration?.displayName).toBe(testData.text);
    });

    it('오디오 글감을 생성한다', async () => {
      // given
      const filePath = path.join(__dirname, 'test.mp3');
      fs.writeFileSync(filePath, 'test-audio');

      const testData = {
        type: 'AUDIO',
      };

      // when
      const { status } = await request(app.getHttpServer())
        .post('/admin/inspirations')
        .attach('file', filePath)
        .field('type', testData.type);

      // then
      expect(status).toBe(201);
      const audioInspiration = await prisma.inspiration.findFirst({
        where: { displayName: 'test.mp3' },
      });
      expect(audioInspiration?.displayName).toBe('test.mp3');

      // clean up
      fs.unlinkSync(filePath);

      const s3Client = new S3Client({});
      await s3Client.send(
        new DeleteObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: 'inspirations/audios/test.mp3',
        }),
      );
    });

    it('비디오 글감을 생성한다', async () => {
      // given
      const filePath = path.join(__dirname, 'test.mp4');
      fs.writeFileSync(filePath, 'test-video');

      const testData = {
        type: 'VIDEO',
      };

      // when
      const { status } = await request(app.getHttpServer())
        .post('/admin/inspirations')
        .attach('file', filePath)
        .field('type', testData.type);

      // then
      expect(status).toBe(201);
      const videoInspiration = await prisma.inspiration.findFirst({
        where: { displayName: 'test.mp4' },
      });
      expect(videoInspiration?.displayName).toBe('test.mp4');

      // clean up
      fs.unlinkSync(filePath);

      const s3Client = new S3Client({});
      await s3Client.send(
        new DeleteObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: 'inspirations/videos/test.mp4',
        }),
      );
    });
  });
});
