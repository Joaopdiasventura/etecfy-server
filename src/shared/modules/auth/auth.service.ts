import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { hash, compare } from 'bcrypt';

@Injectable()
export class AuthService {
  public constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  public async generateToken(sub: string): Promise<string> {
    return await this.jwtService.signAsync(sub);
  }

  public async decodeToken(token: string): Promise<string> {
    try {
      const result = await this.jwtService.verifyAsync(token);
      return result;
    } catch {
      throw new BadRequestException('Faça login novamente');
    }
  }

  public async hashPassword(password: string): Promise<string> {
    const saltRounds = this.configService.get<number>('salts')!;
    return await hash(password, saltRounds);
  }

  public async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<void> {
    const isValid = await compare(password, hashedPassword);
    if (!isValid) throw new UnauthorizedException('Senha incorreta');
  }

  public generateRandomPassword(): string {
    const passwordSize = this.configService.get<number>('randomPasswordSize')!;
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const nums = '0123456789';
    const symbols = '!@#$%^&*()-_=+[]{};:,.?/|~';
    const all = lower + upper + nums + symbols;
    const pick = (s: string): string =>
      s.charAt(Math.floor(Math.random() * s.length));
    const chars: string[] = [
      pick(lower),
      pick(upper),
      pick(nums),
      pick(symbols),
    ];
    for (let i = chars.length; i < passwordSize; i++) chars.push(pick(all));
    for (let i = chars.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [chars[i], chars[j]] = [chars[j], chars[i]];
    }
    return chars.join('');
  }
}
