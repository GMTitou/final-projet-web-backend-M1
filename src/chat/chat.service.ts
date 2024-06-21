import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async getMessages(userId: number) {
    return this.prisma.message.findMany({
      where: {
        OR: [
          {
            senderId: userId,
          },
          {
            recipientId: userId,
          },
        ],
      },
    });
  }

  async sendMessage(content: string, senderId: number, recipientId: number) {
    return this.prisma.message.create({
      data: {
        content,
        sender: {
          connect: {
            id: senderId,
          },
        },
        recipient: {
          connect: {
            id: recipientId,
          },
        },
      },
    });
  }
}
