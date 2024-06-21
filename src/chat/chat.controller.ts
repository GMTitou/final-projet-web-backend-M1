import { Controller, Get, Post, Body, Param, ParseIntPipe } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get('messages/:userId')
  async getMessages(@Param('userId', ParseIntPipe) userId: number) {
    return this.chatService.getMessages(userId);
  }

  @Post('send')
  async sendMessage(@Body() body: { content: string, senderId: number, recipientId: number, conversationId: number }) {
    const { content, senderId, recipientId, conversationId } = body;
    return this.chatService.sendMessage(content, senderId, recipientId, conversationId);
  }

  @Post('conversation')
  async createConversation(@Body() body: { userIds: number[] }) {
    const { userIds } = body;
    return this.chatService.createConversation(userIds);
  }
}
