import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RabbitmqProducer } from './rabbitmq.producer';
import { Prisma } from '@prisma/client';
import { RabbitmqConsumer } from './rabbitmq.consumer';
import { SocketService } from 'src/socket/socket.gateway';
import { WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@Injectable()
export class RabbitmqService {
  @WebSocketServer() server: Server;

  private readonly logger = new Logger(RabbitmqService.name);

  constructor(
    private prisma: PrismaService,
    private readonly rabbitmqProducer: RabbitmqProducer,
    private readonly socketService: SocketService,
  ) {}

  async getMessages(rabbitmqMessages: any, senderId: string, recipientId: string) {
    try {
  
      const prismaMessages = await this.prisma.message.findMany({
        where: {
          OR: [{ senderId }, { recipientId }],
        },
        include: {
          sender: true,
          recipient: true,
          conversation: true,
        },
      });


      return prismaMessages;
    } catch (error) {
      this.logger.error('Error fetching and merging messages:', error);
      throw new Error('Error fetching and merging messages');
    }
  }

  async sendMessage(content: string, senderId: string, recipientId: string) {
    this.logger.log('sendMessage called with:', {
      content,
      senderId,
      recipientId,
    });

    if (!content || !senderId || !recipientId) {
      this.logger.error('Invalid input data');
      throw new Error('Invalid input data');
    }

    try {
      const transaction = await this.prisma.$transaction(async (prisma) => {
        const sender = await prisma.user.findUnique({
          where: { id: senderId },
        });
        
        const recipient = await prisma.user.findUnique({
          where: { id: recipientId },
        });

        if (!sender || !recipient) {
          throw new Error('Sender or recipient not found');
        }

        let conversation = await prisma.conversation.findFirst({
          where: {
            AND: [
              { users: { some: { userId: senderId } } },
              { users: { some: { userId: recipientId } } },
            ],
          },
          include: {
            users: true,
          },
        });

        if (!conversation) {
          conversation = await prisma.conversation.create({
            data: {
              users: {
                create: [{ userId: senderId }, { userId: recipientId }],
              },
            },
            include: {
              users: true,
            },
          });
          this.logger.log('Conversation created successfully:', conversation);
        } else {
          // Vérifiez si les relations utilisateur-conversation existent déjà avant de les ajouter
          const existingUsers = await prisma.conversationUser.findMany({
            where: {
              conversationId: conversation.id,
              userId: { in: [senderId, recipientId] },
            },
          });

          const newUsers = [];
          if (!existingUsers.find((user) => user.userId === senderId)) {
            newUsers.push({ userId: senderId });
          }
          if (!existingUsers.find((user) => user.userId === recipientId)) {
            newUsers.push({ userId: recipientId });
          }

          if (newUsers.length > 0) {
            await prisma.conversationUser.createMany({
              data: newUsers.map((user) => ({
                userId: user.userId,
                conversationId: conversation.id,
              })),
              skipDuplicates: true,
            });
          }

          conversation = await prisma.conversation.update({
            where: { id: conversation.id },
            data: { updatedAt: new Date() },
            include: {
              users: true,
            },
          });
          this.logger.log('Conversation updated successfully:', conversation);
        }

        const message = await prisma.message.create({
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
        this.logger.log('Message created successfully:', message);

        await this.rabbitmqProducer.sendMessage(message);

        return message;
      });

      return transaction;
    } catch (error) {
      this.logger.error('Error creating message:', error);

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // Handle known Prisma errors
        if (error.code === 'P2002') {
          this.logger.error(
            'Unique constraint failed on conversation creation',
          );
          throw new Error('A conversation with these users already exists');
        }
      }

      throw new Error(`Unexpected error: ${error.message}`);
    }
  }
}
