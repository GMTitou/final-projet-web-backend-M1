import { Module } from '@nestjs/common';
import { RabbitmqService } from './rabbitmq.service';
import { RabbitmqController } from './rabbitmq.controller';
import { RabbitmqProducer } from './rabbitmq.producer';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PrismaModule } from 'prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
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
    JwtModule.register({
      secret: 'your_jwt_secret',
      signOptions: { expiresIn: '60m' },
    }),
    ClientsModule.register([
      {
        name: 'CHAT_SERVICE',
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
    ConnectionService,
    UserService,
  ],
  controllers: [RabbitmqController, ConnectionsController],
  exports: [RabbitmqProducer],
})
export class RabbitmqModule {}
