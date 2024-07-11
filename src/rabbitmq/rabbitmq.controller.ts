import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { RabbitmqService } from './rabbitmq.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('chat')
export class RabbitmqController {
  private messagesFromRMQ: any[] = []; 

  constructor(private rabbitmqService: RabbitmqService) {}

  @MessagePattern('message_sent')
  handleMessage(@Payload() data: any) {
    this.messagesFromRMQ.push(data);
  }

  @Get('messages/:senderId/:recipientId')
  async getMessages(
    // @Param('senderId') senderId: string,
    // @Param('recipientId') recipientId: string,
  ) {
    return this.messagesFromRMQ;
  }

  @Post('send')
  async sendMessage(
    @Body() body: { content: string; senderId: string; recipientId: string },
  ) {
    const { content, senderId, recipientId } = body;
    return this.rabbitmqService.sendMessage(content, senderId, recipientId);
  }
}
