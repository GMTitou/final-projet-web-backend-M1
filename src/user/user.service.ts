import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
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

  async createUser(data: CreateUserDto & { uniqueId: string }): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }

  async findAllUsers(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async findUserById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async updateUser(id: number, data: UpdateUserDto): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }
}
