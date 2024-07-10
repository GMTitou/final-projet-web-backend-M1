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
import { ConnectionService } from './connection/connection.service';
import { ConnectionsController } from './connection/connection.controller';
import { UserService } from 'src/user/user.service';

const rabbitmqUrl =
  process.env.NODE_ENV === 'production'
    ? 'amqp://myuser:mypassword@rabbitmq:5672'
    : 'amqp://myuser:mypassword@localhost:5672';

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
        lastName: 'CHAT_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [rabbitmqUrl],
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
    ConnectionService,
    UserService,
    {
      provide: 'PUB_SUB',
      useValue: new PubSub(),
    },
  ],
  controllers: [RabbitmqController, RabbitmqConsumer, ConnectionsController],
  exports: [RabbitmqService, RabbitmqProducer],
})
export class RabbitmqModule {}
