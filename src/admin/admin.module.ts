import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { InspirationModule } from 'src/inspiration/inspiration.module';

@Module({
  imports: [InspirationModule],
  controllers: [AdminController],
})
export class AdminModule {}
