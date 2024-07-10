import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ConnectionService} from './connection/connection.service';
import { UserService } from 'src/user/user.service';
import { connect, Connection, Channel } from 'amqplib';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RabbitmqProducer implements OnModuleInit {
  private connection: Connection;
  private channel: Channel;
  private readonly rabbitmqUser: string;
  private readonly rabbitmqPass: string;
  private readonly rabbitmqHost: string;

  constructor(
    @Inject('CHAT_SERVICE') private readonly client: ClientProxy,
    private readonly connectionService: ConnectionService,
    private readonly userService: UserService,
    private configService: ConfigService,
  ) {
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

  async userConnected(userId: string) {
    const user = await this.userService.findUserById(userId);
    if (!user) {
      throw new Error(`User with id ${userId} not found`);
    }

    const eventData = {
      userId: user.id,
      nom: user.nom,
      prenom: user.prenom,
    };

    this.client.emit('user_connected', { userId });
    this.connectionService.addConnectedUser(eventData);
  }

  async userDisconnected(userId: string) {
    const user = await this.userService.findUserById(userId);
    if (!user) {
      throw new Error(`User with id ${userId} not found`);
    }

    const eventData = {
      userId: user.id,
      nom: user.nom,
      prenom: user.prenom,
    };

    this.client.emit('user_disconnected', { userId });
    this.connectionService.removeConnectedUser(eventData);
  }
}
