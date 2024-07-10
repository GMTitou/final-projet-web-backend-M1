import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { RabbitmqModule } from '../rabbitmq/rabbitmq.module';
import { MessageResolver } from '../rabbitmq/resolvers/message.resolver';
import { UserResolver } from '../user/resolvers/user.resolver';

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: 'schema.gql',
    }),
    RabbitmqModule,
  ],
  providers: [
    MessageResolver,
    UserResolver,
    {
      provide: 'PUB_SUB',
      useValue: new PubSub(),
    },
  ],
})
export class GraphqlModule {}
