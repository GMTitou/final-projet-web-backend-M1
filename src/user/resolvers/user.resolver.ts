import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { UserService } from '../user.service';
import { User } from '../models/user.model';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => [User])
  async users(): Promise<User[]> {
    const users = await this.userService.findAllUsers();
    return users;
  }

  @Query(() => User)
  async user(@Args('id', { type: () => String }) id: string): Promise<User> {
    const user = await this.userService.findUserById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  @Mutation(() => User)
  async createUser(
    @Args('createUserDto') createUserDto: CreateUserDto,
  ): Promise<User> {
    const id: string = this.userService.generateUniqueId(6);
    const user = await this.userService.createUser({ ...createUserDto, id });
    return user;
  }

  @Mutation(() => User)
  async updateUser(
    @Args('id', { type: () => String }) id: string,
    @Args('updateUserDto') updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const user = await this.userService.updateUser(id, updateUserDto);
    return user;
  }
}
