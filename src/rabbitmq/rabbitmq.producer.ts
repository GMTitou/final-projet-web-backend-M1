import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class RabbitmqProducer {
  constructor(@Inject('CHAT_SERVICE') private readonly client: ClientProxy) {}

  async sendMessage(message: any) {
    return this.client.emit('message_sent', message);
  }
}
