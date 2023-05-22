import {
  Controller,
  UseGuards,
  Post,
  Body,
  HttpCode,
  Get,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  async login(@Body() data: AuthDto) {
    return await this.authService.login(data);
  }

  @Post('register')
  @HttpCode(201)
  async register(@Body() createUserDto: CreateUserDto) {
    return await this.authService.register(createUserDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @HttpCode(204)
  @Get('logout')
  logout(@Request() req) {
    const userId = req.user.sub;
    this.authService.logout(userId);
  }

  @UseGuards(AuthGuard('jwt-refresh'))
  @Get('refresh')
  refresh(@Request() req) {
    const userId = req.user.sub;
    const refreshToken = req.user.refreshToken;
    return this.authService.refreshTokens(userId, refreshToken);
  }
}
