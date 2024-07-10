import { Module } from '@nestjs/common';
import { WebsocketsGateway } from './websocket.gateway';

@Module({
  providers: [WebsocketsGateway],
})
export class WebsocketsGatewayModule {}
