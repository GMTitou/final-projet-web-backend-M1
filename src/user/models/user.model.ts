import { Field, ObjectType } from '@nestjs/graphql';
import { Message } from '../../rabbitmq/models/message.model';
import { ConversationUser } from './conversation-user.model';

@ObjectType()
export class User {
  @Field()
  id: string;

  @Field()
  email: string;

  @Field()
  password: string;

  @Field()
  nom: string;

  @Field()
  prenom: string;

  @Field(() => [Message], { nullable: true })
  messagesSent?: Message[];

  @Field(() => [Message], { nullable: true })
  messagesReceived?: Message[];

  @Field(() => [ConversationUser], { nullable: true })
  conversations?: ConversationUser[];
}
