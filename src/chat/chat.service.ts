import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async getMessages(userId: number) {
    console.log(
      `Fetching messages for userId (type: ${typeof userId}): ${userId}`,
    );
    return this.prisma.message.findMany({
      where: {
        OR: [{ senderId: userId }, { recipientId: userId }],
      },
      include: {
        sender: true,
        recipient: true,
        conversation: true,
      },
    });
  }

  async sendMessage(
    content: string,
    senderId: number,
    recipientId: number,
    conversationId: number,
  ) {
    console.log('sendMessage called with:', {
      content,
      senderId,
      recipientId,
      conversationId,
    });
    try {
      const conversation = await this.prisma.conversation.findUnique({
        where: { id: conversationId },
      });
      if (!conversation) {
        console.error(`Conversation with id ${conversationId} not found`);
        throw new Error(`Conversation with id ${conversationId} not found`);
      }

      const message = await this.prisma.message.create({
        data: {
          content,
          sender: {
            connect: { id: senderId },
          },
          recipient: {
            connect: { id: recipientId },
          },
          conversation: {
            connect: { id: conversationId },
          },
        },
      });
      console.log('Message created successfully:', message);
      return message;
    } catch (error) {
      console.error('Error creating message:', error);
      throw new Error('Error creating message');
    }
  }

  async createConversation(userIds: number[]) {
    console.log('createConversation called with:', userIds);
    try {
      // Vérifiez l'existence des utilisateurs
      const users = await this.prisma.user.findMany({
        where: { id: { in: userIds } },
      });
      console.log('Found users:', users);

      if (users.length !== userIds.length) {
        throw new Error('One or more users not found');
      }

      // Créez la conversation et connectez les utilisateurs
      const conversation = await this.prisma.conversation.create({
        data: {
          users: {
            create: userIds.map((userId) => ({
              user: { connect: { id: userId } },
            })),
          },
        },
      });
      console.log('Conversation created successfully:', conversation);
      return conversation;
    } catch (error) {
      console.error('Error creating conversation:', error);
      throw new Error('Error creating conversation');
    }
  }
}
