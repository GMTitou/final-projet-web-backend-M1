import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class RabbitmqProducer {
  constructor(@Inject('CHAT_SERVICE') private readonly client: ClientProxy) {}

  async sendMessage(message: any): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client.emit('message_sent', message).subscribe({
        next: () => resolve(),
        error: (err) => reject(err),
      });
    });
  }
}
