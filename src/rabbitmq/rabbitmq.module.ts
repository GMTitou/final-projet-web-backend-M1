import { Module } from '@nestjs/common';
import { RabbitmqService } from './rabbitmq.service';
import { RabbitmqController } from './rabbitmq.controller';
import { RabbitmqProducer } from './rabbitmq.producer';
import { RabbitmqConsumer } from './rabbitmq.consumer';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PrismaModule } from 'prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { MessageResolver } from './resolvers/message.resolver';
import { PubSub } from 'graphql-subscriptions';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    PrismaModule,
    ConfigModule,
    JwtModule.register({
      secret: 'your_jwt_secret',
      signOptions: { expiresIn: '60m' },
    }),
    ClientsModule.register([
      {
        name: 'CHAT_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://myuser:mypassword@localhost:5672'],
          queue: 'chat_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  providers: [
    RabbitmqService,
    RabbitmqProducer,
    MessageResolver,
    {
      provide: 'PUB_SUB',
      useValue: new PubSub(),
    },
  ],
  controllers: [RabbitmqController, RabbitmqConsumer],
  exports: [RabbitmqService],
})
export class RabbitmqModule {}
