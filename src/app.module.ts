import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthModule } from './user/auth/auth.module';
import { PrismaModule } from 'prisma/prisma.module';
import { ChatModule } from './chat/chat.module';
import { AppController } from './app.controller';
import { UserModule } from './user/user.module';

@Module({
  controllers: [AppController],
  imports: [
    ConfigModule.forRoot(),
    PrismaModule,
    ClientsModule.register([
      {
        name: 'RABBITMQ_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://myuser:mypassword@localhost:5672'],
          queue: 'main_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
    AuthModule,
    ChatModule,
    UserModule, // Add UserModule here
  ],
})
export class AppModule {}
