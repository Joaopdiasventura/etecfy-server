import { IsEmail, IsStrongPassword } from 'class-validator';

export class LoginUserDto {
  @IsEmail({}, { message: 'Digite um email valido' })
  public email: string;

  @IsStrongPassword({}, { message: 'Digite uma senha forte' })
  public password: string;
}
