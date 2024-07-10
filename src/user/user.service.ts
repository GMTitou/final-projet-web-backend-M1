import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { User } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  generateUniqueId(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  isValidPassword(password: string): boolean {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/;
    return passwordRegex.test(password);
  }

  async createUser(data: CreateUserDto & { id: string }): Promise<User> {
    try {
      return await this.prisma.user.create({
        data,
      });
    } catch (error) {
      throw new InternalServerErrorException('Error creating user');
    }
  }

  async findAllUsers(): Promise<User[]> {
    try {
      return await this.prisma.user.findMany({
        include: {
          messagesSent: true,
          messagesReceived: true,
          conversations: true,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Error finding users');
    }
  }

  async findUserById(id: string): Promise<User | null> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
        include: {
          messagesSent: true,
          messagesReceived: true,
          conversations: true,
        },
      });
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      return user;
    } catch (error) {
      throw new InternalServerErrorException('Error finding user by ID');
    }
  }

  async findUserByEmail(email: string): Promise<User | null> {
    try {
      const user = await this.prisma.user.findUnique({ where: { email } });
      if (!user) {
        throw new NotFoundException(`User with email ${email} not found`);
      }
      return user;
    } catch (error) {
      throw new InternalServerErrorException('Error finding user by email');
    }
  }

  async updateUser(id: string, data: UpdateUserDto): Promise<User> {
    try {
      const user = await this.prisma.user.update({
        where: { id },
        data,
        include: {
          messagesSent: true,
          messagesReceived: true,
          conversations: true,
        },
      });
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      return user;
    } catch (error) {
      throw new InternalServerErrorException('Error updating user');
    }
  }
}
