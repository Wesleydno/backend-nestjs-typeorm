import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { compareSync } from 'bcrypt';
import { UsersService } from 'users/users.service';
import { UsersEntity } from '../users/entities/user.entity';
import { AuthDto } from './dto/auth.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async login(data: AuthDto) {
    const user = await this.usersService.findByEmail(data.email);

    if (!user) throw new BadRequestException('User does not exist');

    const isPasswordsValid = compareSync(data.password, user.password);

    if (!isPasswordsValid)
      throw new BadRequestException('Password is incorrect');

    const tokens = await this.getTokens(user);

    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async register(createUserDto: CreateUserDto) {
    const userExists = await this.usersService.findByEmail(createUserDto.email);

    if (userExists) {
      throw new BadRequestException('User already exists');
    }

    const newUser = await this.usersService.create({ ...createUserDto });

    const tokens = await this.getTokens(newUser);
    await this.updateRefreshToken(newUser.id, tokens.refreshToken);
    return tokens;
  }

  async updateRefreshToken(id: string, refreshToken: string) {
    await this.usersService.update(id, {
      refreshToken: refreshToken,
    });
  }

  async getTokens(user: UsersEntity) {
    const payload = { sub: user.id, email: user.email };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_ACCESS_TOKEN,
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH_TOKEN,
        expiresIn: '7d',
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async logout(id: string) {
    return this.usersService.update(id, { refreshToken: null });
  }
}
