import { Injectable } from '@nestjs/common';
import { UsersService } from 'users/users.service';
import { UsersEntity } from '../users/entities/user.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private configService: ConfigService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<Partial<UsersEntity> | null> {
    const user = await this.usersService.findByEmail(email);
    if (user && user.password === password) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: UsersEntity) {
    const payload = { sub: user.id, email: user.email };

    console.log(payload);
  }
}
