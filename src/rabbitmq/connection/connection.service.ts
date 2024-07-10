import { Injectable } from '@nestjs/common';

@Injectable()
export class ConnectionService {
  private connectedUsers: Set<string> = new Set();

  addConnectedUser(eventData: any) {
    this.connectedUsers.add(eventData);
  }

  removeConnectedUser(eventData: any) {
    this.connectedUsers.delete(eventData);
  }

  getConnectedUsers(): string[] {
    return Array.from(this.connectedUsers);
  }
}
