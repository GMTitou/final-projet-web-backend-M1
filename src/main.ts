import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const rabbitmqUrl =
    process.env.NODE_ENV === 'production'
      ? 'amqp://myuser:mypassword@rabbitmq:5672'
      : 'amqp://myuser:mypassword@localhost:5672';

  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [rabbitmqUrl],
      queue: 'chat_queue',
      queueOptions: {
        durable: false,
      },
    },
  });
  app.enableCors({
    origin: ['http://localhost:4200', 'http://localhost:3001'], // Ajout de la nouvelle origine
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  await app.startAllMicroservices();
  await app.listen(3000);
}
bootstrap();
