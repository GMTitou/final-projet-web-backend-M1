import { Controller, Get, Param } from '@nestjs/common';
import { ConversationService } from './conversation.service';

@Controller('conversations')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Get(':userId1/:userId2')
  async getConversationByUserIds(
    @Param('userId1') userId1: string,
    @Param('userId2') userId2: string,
  ) {
    return this.conversationService.getConversationByUserIds(userId1, userId2);
  }
}
