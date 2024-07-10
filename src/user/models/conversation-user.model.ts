// src/rabbitmq/models/conversation-user.model.ts
import { Field, ObjectType } from '@nestjs/graphql';
import { User } from './user.model';
import { Conversation } from '../../rabbitmq/models/conversation.model';

@ObjectType()
export class ConversationUser {
  @Field()
  id: number;

  @Field()
  userId: string;

  @Field()
  conversationId: number;

  @Field(() => User)
  user: User;

  @Field(() => Conversation)
  conversation: Conversation;
}
