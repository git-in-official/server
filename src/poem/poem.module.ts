import { Module } from '@nestjs/common';
import { PoemController } from './poem.controller';
import { PoemService } from './poem.service';
import { PoemRepository } from './poem.repository';
import { AwsModule } from 'src/aws/aws.module';

@Module({
  imports: [AwsModule],
  controllers: [PoemController],
  providers: [PoemService, PoemRepository],
})
export class PoemModule {}
