import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersEntity } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

export type User = any;
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UsersEntity> {
    const user = this.usersRepository.create(createUserDto);
    await this.usersRepository.save(user);
    return user;
  }

  async findAll() {
    return await this.usersRepository.find();
  }

  async findByEmail(email: string): Promise<UsersEntity | undefined> {
    return await this.usersRepository.findOne({ where: { email } });
  }

  async findById(id: string): Promise<UsersEntity | undefined> {
    return await this.usersRepository.findOne({ where: { id } });
  }

  async update(id: string, UpdateUserDto: UpdateUserDto) {
    return await this.usersRepository.update(id, UpdateUserDto);
  }

  async remove(id: string) {
    return await this.usersRepository.delete(id);
  }
}
