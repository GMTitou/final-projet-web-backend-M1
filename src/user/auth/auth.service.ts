import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { UserService } from 'src/user/user.service';
import { RabbitmqProducer } from 'src/rabbitmq/rabbitmq.producer';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private userService: UserService,
    private jwtService: JwtService,
    private rabbitmqProducer: RabbitmqProducer,
  ) {}

  async register(body: any): Promise<{ userId: string; access_token: string }> {
    const id = this.userService.generateUniqueId(6);
    const { email, password, lastName, firstName } = body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      if (!email || !this.userService.isValidEmail(email)) {
        throw new BadRequestException('Invalid email');
      }
      if (!password || !this.userService.isValidPassword(password)) {
        throw new BadRequestException('Invalid password');
      }
      if (!lastName || !firstName) {
        throw new BadRequestException('Invalid name');
      }
      const existingUser = await this.userService.findUserByEmail(email);
      if (existingUser) {
        throw new BadRequestException('Email already exists');
      }

      const user = await this.prisma.user.create({
        data: {
          id,
          lastName,
          firstName,
          email,
          password: hashedPassword,
        },
      });
      const access_token = this.generateToken(user);
      this.logger.log('User created successfully:', { ...user, access_token });

      return { userId: user.id, access_token };
    } catch (error) {
      this.logger.error('Error creating user:', error);
      throw new InternalServerErrorException('Error creating user');
    }
  }

  async login(body: any): Promise<{ userId: string; access_token: string }> {
    try {
      const { email, password } = body;
      const user = await this.prisma.user.findUnique({ where: { email } });
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }
      const access_token = this.generateToken(user);
      await this.rabbitmqProducer.userConnected(user.id);

      this.logger.log('User logged in successfully:', {
        userId: user.id,
        access_token,
      });

      return { userId: user.id, access_token };
    } catch (error) {
      this.logger.error('Error logging in:', error);
      throw new InternalServerErrorException('Error logging in');
    }
  }

  async validateUser(id: string, email?: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id, email },
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

  private generateToken(user: User): string {
    const payload = { email: user.email, sub: user.id };
    return this.jwtService.sign(payload);
  }
}
