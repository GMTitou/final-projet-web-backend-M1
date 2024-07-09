import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class RabbitmqConsumer {
  @EventPattern('message_sent')
  async handleMessage(@Payload() message: any) {
    console.log(`Received message: ${JSON.stringify(message)}`);
  }
}
