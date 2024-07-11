import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ConnectionService } from '../rabbitmq/connection/connection.service';
import { RabbitmqProducer } from '../rabbitmq/rabbitmq.producer';
import { Injectable } from '@nestjs/common';

interface User {
  userId: string;
  lastName: string;
  firstName: string;
}

interface DisconnectData {
  userId: string;
}

@WebSocketGateway({
  cors: true,
})
export class SocketService implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(
    private readonly connectionService: ConnectionService,
    private readonly rabbitmqProducer: RabbitmqProducer,
  ) {}

  async handleConnection(client: Socket) {
    console.log('Client connected');
  }

  async handleDisconnect(client: Socket) {
    console.log('Client disconnected');
  }

  @SubscribeMessage('message_sent')
  async handleMessage(client: Socket, data: any) {
    console.log('Message Gateway:', data);
    this.handleMessageSent(data);
  }

  @SubscribeMessage('user_connected')
  async handleUserConnected(
    client: Socket,
    data: { userId: string; lastName: string; firstName: string },
  ) {
    console.log('User connected:', data);
    this.connectionService.addConnectedUser(data);
    this.server.emit('user_connected', data); // Emit to all clients
    await this.rabbitmqProducer.sendMessage(data);
  }

  @SubscribeMessage('user_disconnected')
  async handleUserDisconnected(client: Socket, data: DisconnectData) {
    console.log('User disconnected:', data);
    this.handleUserDisconnectedEvent(data);
  }

  private async handleMessageSent(data: any) {
    this.server.emit('message_sent', data);
    // await this.rabbitmqProducer.sendMessage(data);
  }

  private async handleUserConnectedEvent(data: User) {
    this.connectionService.addConnectedUser(data);
    this.server.emit('user_connected', data);
    await this.rabbitmqProducer.sendMessage(data);
  }

  private async handleUserDisconnectedEvent(data: DisconnectData) {
    this.connectionService.removeConnectedUser(data.userId);
    this.server.emit('user_disconnected', data);
    await this.rabbitmqProducer.sendMessage(data);
  }
}
