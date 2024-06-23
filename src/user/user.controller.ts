import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
@UseGuards(AuthGuard('jwt'))
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const uniqueId = this.userService.generateUniqueId(6);
    return this.userService.createUser({ ...createUserDto, uniqueId });
  }

  @Get()
  async findAll() {
    return this.userService.findAllUsers();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.userService.findUserById(id);
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser(id, updateUserDto);
  }
}
