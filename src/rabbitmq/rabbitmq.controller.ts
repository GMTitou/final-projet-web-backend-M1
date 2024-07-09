import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { RabbitmqService } from './rabbitmq.service';

@Controller('chat')
export class RabbitmqController {
  constructor(private rabbitmqService: RabbitmqService) {}

  @Get('messages/:id')
  async getMessages(@Param('id') userId: string) {
    return this.rabbitmqService.getMessages(userId);
  }

  @Post('send')
  async sendMessage(@Body() body: { content: string; senderId: string; recipientId: string }) {
    const { content, senderId, recipientId } = body;
    return this.rabbitmqService.sendMessage(content, senderId, recipientId);
  }
}
