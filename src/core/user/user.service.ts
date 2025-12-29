import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IUserRepository } from './repositories/user.repository';
import { User } from './entities/user.entity';
import { AuthService } from '../../shared/modules/auth/auth.service';
import { AuthResponse } from '../../shared/interfaces/responses/auth';
import { LoginUserDto } from './dto/login-user.dto';
import { MessageResponse } from '../../shared/interfaces/responses/message';

@Injectable()
export class UserService {
  public constructor(
    private readonly userRepository: IUserRepository,
    private readonly authService: AuthService,
  ) {}

  public async create(createUserDto: CreateUserDto): Promise<AuthResponse> {
    await this.validateEmail(createUserDto.email);
    createUserDto.password = await this.authService.hashPassword(
      createUserDto.password,
    );
    const user = await this.userRepository.create(createUserDto);
    delete user.password;
    const token = this.authService.generateToken(user.id);
    return { token, user };
  }

  public async login(loginUserDto: LoginUserDto): Promise<AuthResponse> {
    const user = await this.userRepository.findByEmail(loginUserDto.email);
    if (!user) throw new NotFoundException('Conta não encontrada');

    const isPasswordValid = await this.authService.verifyPassword(
      loginUserDto.password,
      user.password!,
    );

    if (!isPasswordValid) throw new BadRequestException('Senha incorreta');

    delete user.password;

    const token = this.authService.generateToken(user.id);
    return { token, user };
  }

  public async findById(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundException('Conta não encontrada');
    return user;
  }

  public async decodeToken(token: string): Promise<User> {
    const id = this.authService.decodeToken(token);
    const user = await this.findById(id);
    delete user.password;
    return user;
  }

  public async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<MessageResponse> {
    const { email } = await this.findById(id);

    if (updateUserDto.email && email != updateUserDto.email)
      await this.validateEmail(updateUserDto.email);

    if (updateUserDto.password)
      updateUserDto.password = await this.authService.hashPassword(
        updateUserDto.password,
      );

    await this.userRepository.update(id, updateUserDto);
    return { message: 'Conta atualizada com sucesso' };
  }

  public async delete(id: string): Promise<MessageResponse> {
    await this.findById(id);
    await this.userRepository.delete(id);
    return { message: 'Conta deletada com sucesso' };
  }

  private async validateEmail(email: string): Promise<void> {
    const user = await this.userRepository.findByEmail(email);
    if (user)
      throw new BadRequestException('Esse email já está sendo utilizado');
  }
}
