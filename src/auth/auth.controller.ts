import { Controller, UseGuards, Post, Body, Get, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() data: AuthDto) {
    return await this.authService.login(data);
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return await this.authService.register(createUserDto);
  }

  @UseGuards(AuthGuard('jwt-refresh'))
  @Get('logout')
  logout(@Req() req: Request) {
    console.log(req)
    // this.authService.logout(req.user['id']);
  }
}
