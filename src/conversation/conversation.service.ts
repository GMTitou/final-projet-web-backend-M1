import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class ConversationService {
  constructor(private readonly prisma: PrismaService) {}

  async getConversationByUserIds(userId1: string, userId2: string) {
    const conversation = await this.prisma.conversation.findFirst({
      where: {
        AND: [
          { users: { some: { userId: userId1 } } },
          { users: { some: { userId: userId2 } } }
        ]
      },
      include: {
        users: {
          include: {
            user: false, 
          },
        },
        messages: true,
      },
    });
    
    return conversation;
  }
}
