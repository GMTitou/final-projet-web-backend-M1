import { Injectable, OnModuleInit } from '@nestjs/common';
import { connect, Connection, Channel } from 'amqplib';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RabbitmqProducer implements OnModuleInit {
  private connection: Connection;
  private channel: Channel;
  private readonly rabbitmqUser: string;
  private readonly rabbitmqPass: string;
  private readonly rabbitmqHost: string;

  constructor(private configService: ConfigService) {
    this.rabbitmqUser = this.configService.get<string>('RABBITMQ_USER');
    this.rabbitmqPass = this.configService.get<string>('RABBITMQ_PASS');
    this.rabbitmqHost =
      this.configService.get<string>('RABBITMQ_HOST') || 'localhost';
  }

  async onModuleInit() {
    await this.connect();
  }

  async connect() {
    try {
      this.connection = await connect(`amqp://localhost:5672`);
      this.channel = await this.connection.createChannel();
      await this.channel.assertQueue('chat_queue', { durable: false });
    } catch (error) {
      console.error('Error connecting to RabbitMQ:', error);
      throw new Error('Failed to connect to RabbitMQ');
    }
  }

  async sendMessage(message: any) {
    if (!this.channel) {
      await this.connect();
    }
    this.channel.sendToQueue(
      'chat_queue',
      Buffer.from(JSON.stringify(message)),
    );
  }
}
