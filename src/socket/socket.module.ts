import { Module } from '@nestjs/common';
import { MyWebSocketGateway } from './socket.gateway';

@Module({
  providers: [MyWebSocketGateway],
})
export class EventsModule {}