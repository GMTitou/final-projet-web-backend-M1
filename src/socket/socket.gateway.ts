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

@WebSocketGateway({
  cors: true,
})
export class MyWebSocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
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

  @SubscribeMessage('user_connected')
  async handleUserConnected(
    client: Socket,
    data: { userId: string; nom: string; prenom: string },
  ) {
    console.log('User connected:', data);
    this.connectionService.addConnectedUser(data);
    this.server.emit('user_connected', data); // Emit to all clients
    await this.rabbitmqProducer.sendMessage(data);
  }

  @SubscribeMessage('user_disconnected')
  async handleUserDisconnected(client: Socket, data: { userId: string }) {
    console.log('User disconnected:', data);
    this.connectionService.removeConnectedUser(data.userId);
    this.server.emit('user_disconnected', data); // Emit to all clients
    await this.rabbitmqProducer.sendMessage(data);
  }
}
