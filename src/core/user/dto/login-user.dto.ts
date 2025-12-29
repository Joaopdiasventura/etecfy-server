import { IsEmail, IsStrongPassword } from 'class-validator';

export class LoginUserDto {
  @IsEmail({}, { message: 'Digite um email válido' })
  public email: string;

  @IsStrongPassword({}, { message: 'Digite uma senha válida' })
  public password: string;
}
