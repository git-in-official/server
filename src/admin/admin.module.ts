import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { InspirationModule } from 'src/inspiration/inspiration.module';
import { PoemModule } from 'src/poem/poem.module';

@Module({
  imports: [InspirationModule, PoemModule],
  controllers: [AdminController],
})
export class AdminModule {}
