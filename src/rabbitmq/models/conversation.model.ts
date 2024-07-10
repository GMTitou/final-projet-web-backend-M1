import { Field, ObjectType } from '@nestjs/graphql';
import { Message } from './message.model';
import { ConversationUser } from '../../user/models/conversation-user.model';

@ObjectType()
export class Conversation {
  @Field()
  id: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => [ConversationUser])
  users: ConversationUser[];

  @Field(() => [Message])
  messages: Message[];
}
