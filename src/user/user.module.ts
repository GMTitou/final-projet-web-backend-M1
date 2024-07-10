import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaModule } from 'prisma/prisma.module';
import { UserResolver } from './resolvers/user.resolver';

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [UserService, UserResolver],
  exports: [UserService],
})
export class UserModule {}
