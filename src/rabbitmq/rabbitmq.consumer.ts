import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { ConnectionService } from './connection/connection.service';

@Controller()
export class RabbitmqConsumer {
  constructor(private readonly connectionService: ConnectionService) {}

  @EventPattern('message_sent')
  async handleMessage(@Payload() message: any) {
    console.log(`Received message: ${JSON.stringify(message)}`);
  }

  @EventPattern('user_connected')
  handleUserConnected(@Payload() data: { userId: string }) {
    this.connectionService.addConnectedUser(data.userId);
    console.log(`User connected: ${data.userId}`);
  }

  @EventPattern('user_disconnected')
  handleUserDisconnected(@Payload() data: { userId: string }) {
    this.connectionService.removeConnectedUser(data.userId);
    console.log(`User disconnected: ${data.userId}`);
  }
}
