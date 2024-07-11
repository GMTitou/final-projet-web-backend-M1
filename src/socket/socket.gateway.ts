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

@WebSocketGateway({
  cors: true,
})
@Injectable()
export class SocketService {
  private io: Server;

  public init(server: any): void {
    this.io = require('socket.io')(server, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });

    this.io.on('connection', (socket: Socket) => {
      console.log('Client connected');

      socket.on('disconnect', () => {
        console.log('Client disconnected');
      });

      socket.on('message_sent', (data) => {
        console.log('Received message from client:', data);
        this.io.emit('message_sent', data); // Diffuse le message à tous les clients connectés
      });
    });
  }

  public getIO(): Server {
    return this.io;
  }

// @Injectable()
// export class SocketService {
//   private io: Server;

//   public init(server: any): void {
//     this.io = require('socket.io')(server, {
//       cors: {
//         origin: '*',
//         methods: ['GET', 'POST'],
//       },
//     });
//   }

//   public sendEvent(eventName: string, eventData: any): void {
//     console.log('Sending event:', eventName, eventData);
    
//     this.io.emit(eventName, eventData);
//   }
// }
// export class SocketService
//   implements OnGatewayConnection, OnGatewayDisconnect
// {
//   @WebSocketServer() server: Server;

//   constructor(
//     private readonly connectionService: ConnectionService,
//     private readonly rabbitmqProducer: RabbitmqProducer,
//   ) {}

//   async handleConnection(client: Socket) {
//     console.log('Client connected');
//   }

//   async handleDisconnect(client: Socket) {
//     console.log('Client disconnected');
//   }

//   @SubscribeMessage('message_sent')
//   async handleMessage(
//     client: Socket,
//     data: any
//   ) {
//     console.log('Message Gateway:', data);
//     // this.connectionService.addConnectedUser(data);
//     this.server.emit('message_sent', data); // Emit to all clients
//     // await this.rabbitmqProducer.sendMessage(data);
//   }
  // @SubscribeMessage('user_connected')
  // async handleUserConnected(
  //   client: Socket,
  //   data: { userId: string; lastName: string; firstName: string },
  // ) {
  //   console.log('User connected:', data);
  //   this.connectionService.addConnectedUser(data);
  //   this.server.emit('user_connected', data); // Emit to all clients
  //   await this.rabbitmqProducer.sendMessage(data);
  // }

  // @SubscribeMessage('user_disconnected')
  // async handleUserDisconnected(client: Socket, data: { userId: string }) {
  //   console.log('User disconnected:', data);
  //   this.connectionService.removeConnectedUser(data.userId);
  //   this.server.emit('user_disconnected', data); // Emit to all clients
  //   await this.rabbitmqProducer.sendMessage(data);
  // }
}
