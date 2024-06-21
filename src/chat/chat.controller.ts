import {
  Controller,
  Get,
  Post,
  Body,
  Param,
} from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get('messages/:id')
  async getMessages(@Param('id') userId: string) {
    return this.chatService.getMessages(userId);
  }

  @Post('send')
  async sendMessage(
    @Body() body: { content: string; senderId: string; recipientId: string },
  ) {
    const { content, senderId, recipientId } = body;
    return this.chatService.sendMessage(content, senderId, recipientId);
  }
}
