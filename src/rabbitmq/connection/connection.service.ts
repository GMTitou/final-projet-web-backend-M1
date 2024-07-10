import { Injectable } from '@nestjs/common';

@Injectable()
export class ConnectionService {
  private connectedUsers: any[] = [];

  addConnectedUser(user: any) {
    this.connectedUsers.push(user);
  }

  removeConnectedUser(user: any) {
    this.connectedUsers = this.connectedUsers.filter(
      (u) => u.userId !== user.userId,
    );
  }

  getConnectedUsers() {
    return this.connectedUsers;
  }
}
