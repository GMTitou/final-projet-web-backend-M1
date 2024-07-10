import { Resolver, Query, Mutation, Args, Subscription } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { RabbitmqService } from '../rabbitmq.service';
import { Message } from '../models/message.model';

@Resolver(() => Message)
export class MessageResolver {
  constructor(
    private readonly rabbitmqService: RabbitmqService,
    @Inject('PUB_SUB') private readonly pubSub: PubSub,
  ) {}

  @Query(() => [Message])
  async messages(): Promise<Message[]> {
    return this.rabbitmqService.getMessages();
  }

  @Mutation(() => Message)
  async sendMessage(
    @Args('content') content: string,
    @Args('senderId') senderId: string,
    @Args('recipientId') recipientId: string,
  ): Promise<Message> {
    const message = await this.rabbitmqService.sendMessage(
      content,
      senderId,
      recipientId,
    );
    this.pubSub.publish('messageSent', { messageSent: message });
    return message;
  }

  @Subscription(() => Message, {
    resolve: (value) => value.messageSent,
  })
  messageSent() {
    return this.pubSub.asyncIterator('messageSent');
  }
}
