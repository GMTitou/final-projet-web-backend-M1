import { Controller, Get, Post, Body, Request } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('messages/:userId')
  getMessages(@Request() req) {
    const userId = parseInt(req.params.userId, 10);
    return this.chatService.getMessages(userId);
  }

  @Post('send')
  sendMessage(@Body() body) {
    const { content, senderId, recipientId } = body;
    return this.chatService.sendMessage(content, senderId, recipientId);
  }
}
