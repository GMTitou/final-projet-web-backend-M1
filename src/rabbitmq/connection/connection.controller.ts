import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConnectionService } from './connection.service';

@Controller('connections')
export class ConnectionsController {
  constructor(private readonly connectionService: ConnectionService) {}

  @Post('add')
  @HttpCode(HttpStatus.CREATED)
  async addConnectedUser(@Body() user: any): Promise<void> {
    try {
      this.connectionService.addConnectedUser(user);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('remove')
  @HttpCode(HttpStatus.OK)
  async removeConnectedUser(@Body() user: any): Promise<void> {
    try {
      this.connectionService.removeConnectedUser(user);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  getConnectedUsers(): any[] {
    try {
      return this.connectionService.getConnectedUsers();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
