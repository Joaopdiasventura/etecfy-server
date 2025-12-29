import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from '../../auth.service';
import { AuthRequest } from '../../../../interfaces/request/auth';

@Injectable()
export class AuthGuard implements CanActivate {
  public constructor(private readonly authService: AuthService) {}

  public canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<AuthRequest>();
    const token = request.cookies?.auth_token;
    if (!token) throw new ForbiddenException('Faça login novamente');
    request.user = this.authService.decodeToken(token);
    return true;
  }
}
