import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import {
  TextInspirationDto,
  FileInspirationDto,
} from 'src/inspiration/dto/response';

export function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('to_morrow API')
    .setDescription('to_morrow API description')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('to_morrow')
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    extraModels: [TextInspirationDto, FileInspirationDto],
  });

  SwaggerModule.setup('api', app, document);
}
