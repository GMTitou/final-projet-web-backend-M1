import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async getMessages(Id: string) {
    console.log(`Fetching messages for userId (type: ${typeof Id}): ${Id}`);
    return this.prisma.message.findMany({
      where: {
        OR: [{ senderId: Id }, { recipientId: Id }],
      },
      include: {
        sender: true,
        recipient: true,
        conversation: true,
      },
    });
  }

  async sendMessage(content: string, senderId: string, recipientId: string) {
    console.log('sendMessage called with:', { content, senderId, recipientId });

    try {
      let conversation = await this.prisma.conversation.findFirst({
        where: {
          AND: [
            { users: { some: { userId: senderId } } },
            { users: { some: { userId: recipientId } } },
          ],
        },
      });

      if (!conversation) {
        conversation = await this.prisma.conversation.create({
          data: {
            users: {
              create: [{ userId: senderId }, { userId: recipientId }],
            },
          },
        });
        console.log('Conversation created successfully:', conversation);
      } else {
        conversation = await this.prisma.conversation.update({
          where: { id: conversation.id },
          data: { updatedAt: new Date() },
        });
        console.log('Conversation updated successfully:', conversation);
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
            connect: { id: conversation.id },
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
}
