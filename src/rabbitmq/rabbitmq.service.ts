import {
  Injectable,
  Logger,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Message } from '@prisma/client';
import { RabbitmqProducer } from './rabbitmq.producer';

@Injectable()
export class RabbitmqService {
  private readonly logger = new Logger(RabbitmqService.name);

  constructor(
    private prisma: PrismaService,
    private readonly rabbitmqProducer: RabbitmqProducer,
  ) {}

  async getMessages(Id?: string): Promise<Message[]> {
    try {
      if (Id) {
        this.logger.log(
          `Fetching messages for userId (type: ${typeof Id}): ${Id}`,
        );
        return await this.prisma.message.findMany({
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
      return await this.prisma.message.findMany({
        include: {
          sender: true,
          recipient: true,
          conversation: true,
        },
      });
    } catch (error) {
      this.logger.error('Error fetching messages:', error);
      throw new InternalServerErrorException('Error fetching messages');
    }
  }

  async sendMessage(
    content: string,
    senderId: string,
    recipientId: string,
  ): Promise<Message> {
    this.logger.log('sendMessage called with:', {
      content,
      senderId,
      recipientId,
    });

    try {
      if (!content || !senderId || !recipientId) {
        throw new BadRequestException('Missing required fields');
      }

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
        this.logger.log('Conversation created successfully:', conversation);
      } else {
        conversation = await this.prisma.conversation.update({
          where: { id: conversation.id },
          data: { updatedAt: new Date() },
        });
        this.logger.log('Conversation updated successfully:', conversation);
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
        include: {
          sender: true,
          recipient: true,
          conversation: true,
        },
      });
      this.logger.log('Message created successfully:', message);

      await this.rabbitmqProducer.sendMessage(message);

      return message;
    } catch (error) {
      this.logger.error('Error creating message:', error);
      throw new InternalServerErrorException('Error creating message');
    }
  }
}
