import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateUserDto {
<<<<<<< HEAD
  @Field({ nullable: true })
  nom: string;

  @Field({ nullable: true })
  prenom: string;

  @Field({ nullable: true })
=======
  uniqueId: string;
  lastName: string;
  firstName: string;
>>>>>>> 5f8eedf76d2ed7b03ad7e4394fdbf2ee572c922f
  email: string;

  @Field({ nullable: true })
  password: string;
}
