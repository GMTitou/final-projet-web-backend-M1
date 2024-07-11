import { Controller, Injectable } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
  Transport,
} from '@nestjs/microservices';
import { ConnectionService } from './connection/connection.service';
import { RabbitmqService } from './rabbitmq.service';

@Controller()
export class RabbitmqConsumer {
  private readonly connectionService: ConnectionService;

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
