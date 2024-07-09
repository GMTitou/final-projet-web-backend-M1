import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthModule } from './user/auth/auth.module';
import { PrismaModule } from 'prisma/prisma.module';
import { ChatModule } from './chat/chat.module';
import { AppController } from './app.controller';
import { AppService } from './app.service'; // Import AppService
import { UserModule } from './user/user.module';

@Module({
  controllers: [AppController],
  providers: [AppService], // Provide AppService here
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
    UserModule,
  ],
})
export class AppModule {}
