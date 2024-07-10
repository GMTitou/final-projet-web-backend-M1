import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(body: any) {
    const id = this.userService.generateUniqueId(6);
    const { email, password, nom, prenom } = body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      if (!email || !this.userService.isValidEmail(email)) {
        throw new Error('Invalid email');
      }
      if (!password || !this.userService.isValidPassword(password)) {
        throw new Error('Invalid password');
      }
      if (!nom || !prenom) {
        throw new Error('Invalid name');
      }
      const existingUser = await this.userService.findUserByEmail(email);
      if (existingUser) {
        throw new Error('Email already exists');
      }

      const user = await this.prisma.user.create({
        data: {
          id,
          nom: nom,
          prenom,
          email,
          password: hashedPassword,
        },
      });
      const access_token = this.generateToken(user);
      console.log('User created successfully:', { ...user, ...access_token });

      return { userId: user.id, access_token };
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

  async validateUser(id: string, email?: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id: id, email: email },
      include: {
        messagesSent: true,
        messagesReceived: true,
        conversations: {
          include: {
            conversation: true,
          },
        },
      },
    });
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
