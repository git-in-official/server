import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { UserPrismaRepository } from './user.prisma.repository';
import { UserController } from './user.controller';
import { ScrapRepository } from '../poem/scrap.repository';
import { ScrapPrismaRepository } from '../poem/scrap.prisma.repository';

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: UserRepository,
      useClass: UserPrismaRepository,
    },
    {
      provide: ScrapRepository,
      useClass: ScrapPrismaRepository,
    },
  ],
  exports: [UserRepository],
})
export class UserModule {}
