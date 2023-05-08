import { IsEmail, IsNotEmpty, Matches } from 'class-validator';
import { MessageHelper } from '../../helpers/messages.helper';
import { RegExHelper } from '../../helpers/regex.helper';

export class CreateUserDto {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Matches(RegExHelper.password, { message: MessageHelper.PASSWORD_VALID })
  password: string;
}
