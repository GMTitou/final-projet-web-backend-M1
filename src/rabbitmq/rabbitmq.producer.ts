import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ConnectionService } from './connection/connection.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class RabbitmqProducer {
  constructor(
    @Inject('CHAT_SERVICE') private readonly client: ClientProxy,
    private readonly connectionService: ConnectionService,
    private readonly userService: UserService, // Injectez votre UserService ici
  ) {}

  async sendMessage(message: any): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client.emit('message_sent', message).subscribe({
        next: () => resolve(),
        error: (err) => reject(err),
      });
    });
  }

  async userConnected(userId: string) {
    const user = await this.userService.findUserById(userId); // Utilisez votre UserService pour trouver l'utilisateur
    if (!user) {
      throw new Error(`User with id ${userId} not found`);
    }

    const eventData = {
      userId: user.id,
      lastName: user.lastName,
      firstName: user.firstName,
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
      lastName: user.lastName,
      firstName: user.firstName,
    };

    this.client.emit('user_disconnected', { userId });
    this.connectionService.removeConnectedUser(eventData);
  }
}
