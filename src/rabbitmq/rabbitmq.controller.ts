import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { RabbitmqService } from './rabbitmq.service';

@Controller('chat')
export class RabbitmqController {
  constructor(private readonly rabbitmqService: RabbitmqService) {}

  @Get('messages/:id')
  @HttpCode(HttpStatus.OK)
  async getMessages(@Param('id') userId: string): Promise<any> {
    try {
      return await this.rabbitmqService.getMessages(userId);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('send')
  @HttpCode(HttpStatus.CREATED)
  async sendMessage(
    @Body() body: { content: string; senderId: string; recipientId: string },
  ): Promise<any> {
    try {
      const { content, senderId, recipientId } = body;
      return await this.rabbitmqService.sendMessage(
        content,
        senderId,
        recipientId,
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
