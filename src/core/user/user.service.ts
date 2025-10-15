import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { Message } from '../../shared/interfaces/messages';
import { AuthMessage } from '../../shared/interfaces/messages/auth';
import { AuthService } from '../../shared/modules/auth/auth.service';
import { EmailService } from '../../shared/modules/email/email.service';
import { User } from './entities/user.entity';
import type { IUserRepository } from './repositories/user.repository';

@Injectable()
export class UserService {
  public constructor(
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
    private readonly authService: AuthService,
    private readonly emailService: EmailService,
  ) {}

  public async create(createUserDto: CreateUserDto): Promise<AuthMessage> {
    await this.throwIfEmailIsUsed(createUserDto.email);
    createUserDto.password = await this.authService.hashPassword(
      createUserDto.password,
    );
    const result = await this.userRepository.create(createUserDto);
    const token = await this.authService.generateToken(result.id);

    const user = result.toObject();
    delete user.password;

    return { message: 'Usuário criado com sucesso', token, user };
  }

  public async login(loginUserDto: LoginUserDto): Promise<AuthMessage> {
    const result = await this.findByEmail(loginUserDto.email);
    if (!result) throw new NotFoundException('Usuário não encontrado');

    await this.authService.comparePassword(
      loginUserDto.password,
      result.password!,
    );

    const token = await this.authService.generateToken(result.id);
    const user = result.toObject();
    delete user.password;

    return { message: 'Login realizado com sucesso', token, user };
  }

  public async findById(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundException('Usuário não encontrado');
    return user;
  }

  public async decodeToken(token: string): Promise<User> {
    const id = await this.authService.decodeToken(token);
    const result = await this.findById(id);
    const user = result.toObject();
    delete user.password;
    return user;
  }

  public async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<Message> {
    const { email, password } = await this.findById(id);

    if (updateUserDto.email && updateUserDto.email != email)
      await this.throwIfEmailIsUsed(updateUserDto.email);

    if (updateUserDto.password && updateUserDto.password != password)
      updateUserDto.password = await this.authService.hashPassword(
        updateUserDto.password,
      );

    await this.userRepository.update(id, updateUserDto);
    return { message: 'Usuário atualizado com sucesso' };
  }

  public async resetPassword(email: string): Promise<Message> {
    const { id } = await this.findByEmail(email);
    const newPassword = this.authService.generateRandomPassword();
    const hashedPassword = await this.authService.hashPassword(newPassword);
    await this.userRepository.update(id, { password: hashedPassword });
    await this.emailService.sendMail({
      to: email,
      subject: 'NOVA SENHA EPV',
      html: this.emailService.createNewPasswordMessage(newPassword),
    });
    return { message: 'Nova senha enviada para o seu email' };
  }

  public async delete(id: string): Promise<Message> {
    await this.findById(id);
    await this.userRepository.delete(id);
    return { message: 'Usuário deletado com sucesso' };
  }

  private async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new NotFoundException('Usuário não encontrado');
    return user;
  }

  private async throwIfEmailIsUsed(email: string): Promise<void> {
    const user = await this.userRepository.findByEmail(email);
    if (user) throw new BadRequestException('O email já está em uso');
  }
}
