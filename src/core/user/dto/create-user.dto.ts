import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'Digite um email valido' })
  public email: string;

  @IsNotEmpty({ message: 'Digite um nome valido' })
  @IsString({ message: 'Digite um nome valido' })
  public name: string;

  @IsStrongPassword({}, { message: 'Digite uma senha forte' })
  public password: string;
}
