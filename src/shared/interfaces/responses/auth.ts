import { User } from '../../../core/user/entities/user.entity';

export interface AuthResponse {
  token: string;
  user: User;
}
