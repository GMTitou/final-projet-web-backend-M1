import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateUserDto {
  @Field({ nullable: true })
  nom: string;

  @Field({ nullable: true })
  prenom: string;

  @Field({ nullable: true })
  email: string;

  @Field({ nullable: true })
  password: string;
}
