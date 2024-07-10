import { Controller, Get } from '@nestjs/common';
import { ConnectionService } from './connection.service';

@Controller('connections')
export class ConnectionsController {
  constructor(private readonly connectionService: ConnectionService) {}

  @Get()
  getConnectedUsers() {
    return this.connectionService.getConnectedUsers();
  }
}
