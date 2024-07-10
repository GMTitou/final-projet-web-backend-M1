import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './user/auth/auth.module';
import { PrismaModule } from 'prisma/prisma.module';
import { RabbitmqModule } from './rabbitmq/rabbitmq.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { UserModule } from './user/user.module';
import * as process from 'node:process';
import { join } from 'path';
import { UserResolver } from './user/resolvers/user.resolver';
import { PubSub } from 'graphql-subscriptions';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PrismaModule,
    AuthModule,
    RabbitmqModule,
    UserModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
  ],
  providers: [
    UserResolver,
    {
      provide: 'PUB_SUB',
      useValue: new PubSub(),
    },
  ],
})
export class AppModule {}
