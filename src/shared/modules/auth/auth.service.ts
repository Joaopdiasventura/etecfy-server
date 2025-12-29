import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';

@Injectable()
export class AuthService {
  public constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  public generateToken(payload: string): string {
    return this.jwtService.sign(payload);
  }

  public decodeToken(token: string): string {
    return this.jwtService.decode(token);
  }

  public hashPassword(password: string): Promise<string> {
    const salts = this.configService.get<number>('salts')!;
    return hash(password, salts);
  }

  public verifyPassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return compare(password, hashedPassword);
  }
}
