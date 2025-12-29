import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'Digite um email válido' })
  public email: string;

  @IsNotEmpty({ message: 'Digite um nome válido' })
  public name: string;

  @IsStrongPassword({}, { message: 'Digite uma senha válida' })
  public password: string;
}
