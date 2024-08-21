import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { InspirationModule } from './inspiration/inspiration.module';
import { PoemModule } from './poem/poem.module';
import { AwsModule } from './aws/aws.module';
import { EmotionModule } from './emotion/emotion.module';
import { TagModule } from './tag/tag.module';
import { PipesModule } from './common/pipes/pipes.module';
import { AchievementModule } from './achievement/achievement.module';

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      cache: true,
    }),
    PipesModule,
    AuthModule,
    UserModule,
    InspirationModule,
    PoemModule,
    AwsModule,
    EmotionModule,
    TagModule,
    AchievementModule,
  ],
})
export class AppModule {}
