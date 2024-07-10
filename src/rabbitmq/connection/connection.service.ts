import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class ConnectionService {
  private connectedUsers: any[] = [];

  addConnectedUser(user: any): void {
    if (!user || !user.userId) {
      throw new BadRequestException('User object is invalid');
    }
    this.connectedUsers.push(user);
  }

  removeConnectedUser(user: any): void {
    if (!user || !user.userId) {
      throw new BadRequestException('User object is invalid');
    }
    this.connectedUsers = this.connectedUsers.filter(
      (u) => u.userId !== user.userId,
    );
    if (this.connectedUsers.length === 0) {
      throw new NotFoundException('User not found in connected users');
    }
  }

  getConnectedUsers(): any[] {
    return this.connectedUsers;
  }
}
