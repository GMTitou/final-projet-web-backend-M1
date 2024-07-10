import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateUserDto {
  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  password?: string;

  @Field({ nullable: true })
  nom: string;

  @Field({ nullable: true })
  prenom: string;

  @Field({ nullable: true })
  uniqueId: string;
}
