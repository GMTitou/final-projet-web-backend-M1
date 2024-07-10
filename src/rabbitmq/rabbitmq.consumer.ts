import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { ConnectionService } from './connection/connection.service';

@Controller()
export class RabbitmqConsumer {
  constructor(private readonly connectionService: ConnectionService) {}

  @EventPattern('message_sent')
  async handleMessage(@Payload() message: any): Promise<void> {
    try {
      console.log(`Received message: ${JSON.stringify(message)}`);
    } catch (error) {
      console.error('Error handling message:', error);
    }
  }

  @EventPattern('user_connected')
  handleUserConnected(@Payload() data: { userId: string }): void {
    try {
      this.connectionService.addConnectedUser(data.userId);
      console.log(`User connected: ${data.userId}`);
    } catch (error) {
      console.error('Error handling user connection:', error);
    }
  }

  @EventPattern('user_disconnected')
  handleUserDisconnected(@Payload() data: { userId: string }): void {
    try {
      this.connectionService.removeConnectedUser(data.userId);
      console.log(`User disconnected: ${data.userId}`);
    } catch (error) {
      console.error('Error handling user disconnection:', error);
    }
  }
}
