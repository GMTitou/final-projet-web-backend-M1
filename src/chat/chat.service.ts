import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async getMessages(Id: string) {
    console.log(`Fetching messages for userId (type: ${typeof Id}): ${Id}`);

    try {
      const messages = await this.prisma.message.findMany({
        where: {
          OR: [{ senderId: Id }, { recipientId: Id }],
        },
        include: {
          sender: true,
          recipient: true,
          conversation: true,
        },
      });

      if (!messages.length) {
        const message = `No messages found for userId: ${Id}`;
        console.log(message);
        return { message };
      }

      const successMessage = `Successfully fetched messages for userId: ${Id}`;
      console.log(successMessage);
      return {
        message: successMessage,
        data: messages,
      };
    } catch (error) {
      const errorMessage = `Failed to fetch messages for userId: ${Id}`;
      console.error(errorMessage, error);

      throw new HttpException(
        { message: errorMessage, error: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async sendMessage(content: string, senderId: string, recipientId: string) {
    console.log('Calling sendMessage with:', {
      content,
      senderId,
      recipientId,
    });

    try {
      // Trouver la conversation existante
      let conversation = await this.prisma.conversation.findFirst({
        where: {
          AND: [
            { users: { some: { userId: senderId } } },
            { users: { some: { userId: recipientId } } },
          ],
        },
      });

      // Si aucune conversation n'existe, en créer une nouvelle
      if (!conversation) {
        conversation = await this.prisma.conversation.create({
          data: {
            users: {
              create: [{ userId: senderId }, { userId: recipientId }],
            },
          },
        });
        console.log('Conversation created successfully');
      } else {
        // Mettre à jour la conversation existante
        conversation = await this.prisma.conversation.update({
          where: { id: conversation.id },
          data: { updatedAt: new Date() },
        });
        console.log('Conversation updated successfully');
      }

      // Créer le message
      const message = await this.prisma.message.create({
        data: {
          content,
          sender: { connect: { id: senderId } },
          recipient: { connect: { id: recipientId } },
          conversation: { connect: { id: conversation.id } },
        },
      });
      console.log('Message created successfully');

      return {
        message: 'Message sent successfully',
        data: message,
      };
    } catch (error) {
      console.error('Error creating message:', error);

      throw new HttpException(
        { message: 'Error creating message', error: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
