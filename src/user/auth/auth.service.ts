import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(body: any) {
    const uniqueId = this.userService.generateUniqueId(6);
    const { email, password } = body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      const user = await this.prisma.user.create({
        data: {
          uniqueId,
          email,
          password: hashedPassword,
        },
      });
      return this.generateToken(user);
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('Error creating user');
    }
  }

  async login(body: any) {
    const { email, password } = body;
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.generateToken(user);
  }

  async validateUser(userId: number, email: string): Promise<User> {
    let user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      const uniqueId = this.userService.generateUniqueId(6);
      user = await this.prisma.user.create({
        data: {
          uniqueId,
          email,
          password: '',
        },
      });
    }
    return user;
  }

  async auth0Login(user: User) {
    return this.generateToken(user);
  }

  private generateToken(user: User) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
