import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { Message } from '../../shared/interfaces/messages';
import { AuthMessage } from '../../shared/interfaces/messages/auth';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  public constructor(private readonly userService: UserService) {}

  @Post()
  public create(@Body() createUserDto: CreateUserDto): Promise<AuthMessage> {
    return this.userService.create(createUserDto);
  }

  @HttpCode(200)
  @Post('login')
  public login(@Body() loginUserDto: LoginUserDto): Promise<AuthMessage> {
    return this.userService.login(loginUserDto);
  }

  @Get('decodeToken/:token')
  public decodeToken(@Param('token') token: string): Promise<User> {
    return this.userService.decodeToken(token);
  }

  @Patch(':id')
  public update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<Message> {
    return this.userService.update(id, updateUserDto);
  }

  @Patch('resetPassword/:email')
  public resetPassword(@Param('email') email: string): Promise<Message> {
    return this.userService.resetPassword(email);
  }

  @Delete(':id')
  public delete(@Param('id', ParseObjectIdPipe) id: string): Promise<Message> {
    return this.userService.delete(id);
  }
}
