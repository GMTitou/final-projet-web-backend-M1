import { Module } from '@nestjs/common';
import { SocketService } from './socket.gateway';

@Module({
  providers: [SocketService],
})
export class EventsModule {}