import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './user/auth/auth.module';
import { PrismaModule } from 'prisma/prisma.module';
import { RabbitmqModule } from './rabbitmq/rabbitmq.module';
import { MyWebSocketGateway } from './socket/socket.gateway';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PrismaModule,
    AuthModule,
    RabbitmqModule,
  ],
  controllers: [],
  providers: [MyWebSocketGateway],
  exports: [], 
})
export class AppModule {}
