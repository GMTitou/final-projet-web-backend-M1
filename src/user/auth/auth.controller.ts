import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: any) {
    try {
      return await this.authService.register(body);
    } catch (error) {
      console.error('Error registering user:', error);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('login')
  async login(@Body() body: any) {
    try {
      return await this.authService.login(body);
    } catch (error) {
      console.error('Error logging in user:', error);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('test')
  @UseGuards(AuthGuard('auth0'))
  async testAuth(@Req() req) {
    try {
      const user = req.user;
      const token = await this.authService.auth0Login(user);
      return { user, token };
    } catch (error) {
      console.error('Error testing Auth0 authentication:', error);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  getProfile(@Req() req) {
    try {
      return req.user;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
