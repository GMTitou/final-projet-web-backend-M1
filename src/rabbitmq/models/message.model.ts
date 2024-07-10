// models/message.model.ts
import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '../../user/models/user.model';
import { Conversation } from './conversation.model';

@ObjectType()
export class Message {
  @Field()
  id: number;

  @Field()
  content: string;

  @Field()
  senderId: string;

  @Field()
  recipientId: string;

  @Field()
  conversationId: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => User, { nullable: true })
  sender?: User;

  @Field(() => User, { nullable: true })
  recipient?: User;

  @Field(() => Conversation, { nullable: true })
  conversation?: Conversation;
}
