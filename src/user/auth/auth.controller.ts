import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  BadRequestException,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() body: any,
  ): Promise<{ userId: string; access_token: string }> {
    try {
      return await this.authService.register(body);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      }
      throw new InternalServerErrorException('Error registering user');
    }
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() body: any,
  ): Promise<{ userId: string; access_token: string }> {
    try {
      return await this.authService.login(body);
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw new UnauthorizedException(error.message);
      }
      throw new InternalServerErrorException('Error logging in');
    }
  }
}
