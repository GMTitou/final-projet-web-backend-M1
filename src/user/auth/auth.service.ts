import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
  ) {}

  async register(body: any) {
    const { email, password } = body;
  
    const existingUser = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });
  
    if (existingUser) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }
  
    const id = this.userService.generateUniqueId(6);
    const hashedPassword = await bcrypt.hash(password, 10);
  
    try {
      const user = await this.prisma.user.create({
        data: {
          id: id,
          email,
          password: hashedPassword,
        },
      });
      return { message: 'User successfully registered', user };
    } catch (error) {
      throw new HttpException('Failed to register user', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // async login(body: any) {
  //   const { email, password } = body;
  // }
}
