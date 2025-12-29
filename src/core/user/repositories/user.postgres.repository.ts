import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../entities/user.entity';
import { IUserRepository } from './user.repository';
import { Repository } from 'typeorm';

export class UserPostgresRepository implements IUserRepository {
  public constructor(
    @InjectRepository(User) private readonly repository: Repository<User>,
  ) {}

  public create(createUserDto: CreateUserDto): Promise<User> {
    return this.repository.save(createUserDto);
  }

  public findById(id: string): Promise<User | null> {
    return this.repository.findOne({ where: { id } });
  }

  public findByEmail(email: string): Promise<User | null> {
    return this.repository.findOne({ where: { email } });
  }

  public async update(id: string, updateUserDto: UpdateUserDto): Promise<void> {
    console.log(id, updateUserDto);

    await this.repository.update(id, updateUserDto);
  }

  public async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
