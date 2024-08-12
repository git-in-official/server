import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { InspirationModule } from './inspiration/inspiration.module';
import { PoemModule } from './poem/poem.module';
import { EmotionModule } from './emotion/emotion.module';

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      cache: true,
    }),
    AuthModule,
    UserModule,
    InspirationModule,
    PoemModule,
    EmotionModule,
  ],
})
export class AppModule {}
