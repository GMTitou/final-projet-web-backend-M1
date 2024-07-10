import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateUserDto {
<<<<<<< HEAD
  @Field({ nullable: true })
=======
  lastName?: string;
  firstName?: string;
>>>>>>> 5f8eedf76d2ed7b03ad7e4394fdbf2ee572c922f
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
