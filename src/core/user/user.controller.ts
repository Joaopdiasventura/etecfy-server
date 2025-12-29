import {
  Controller,
  Post,
  Body,
  Patch,
  Delete,
  Res,
  HttpCode,
  Req,
  Get,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ConfigService } from '@nestjs/config';
import { User } from './entities/user.entity';
import { LoginUserDto } from './dto/login-user.dto';
import type { Response } from 'express';
import type { AuthRequest } from '../../shared/interfaces/request/auth';
import { MessageResponse } from '../../shared/interfaces/responses/message';
import { AuthGuard } from '../../shared/modules/auth/guards/auth/auth.guard';

@Controller('user')
export class UserController {
  public constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  @Post()
  public async create(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<User> {
    const { token, user } = await this.userService.create(createUserDto);
    this.setAuthCookie(res, token);
    return user;
  }

  @Post('login')
  @HttpCode(200)
  public async login(
    @Body() loginUserDto: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<User> {
    const { token, user } = await this.userService.login(loginUserDto);
    this.setAuthCookie(res, token);
    return user;
  }

  @Post('logout')
  @HttpCode(204)
  public logout(@Res({ passthrough: true }) res: Response): void {
    res.clearCookie('auth_token', { path: '/' });
  }

  @Get()
  public decodeToken(@Req() { cookies }: AuthRequest): Promise<User> {
    return this.userService.decodeToken(cookies.auth_token || '');
  }

  @Patch()
  @UseGuards(AuthGuard)
  public update(
    @Req() { user }: AuthRequest,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<MessageResponse> {
    return this.userService.update(user, updateUserDto);
  }

  @Delete()
  @UseGuards(AuthGuard)
  public delete(@Req() { user }: AuthRequest): Promise<MessageResponse> {
    return this.userService.delete(user);
  }

  private setAuthCookie(res: Response, token: string): void {
    const env = this.configService.get<string>('env');
    const isProd = env == 'production';
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'strict' : 'lax',
      path: '/',
    });
  }
}
