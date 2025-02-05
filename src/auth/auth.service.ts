import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService
  ) {}

  async login(email: string, senha: string) {
    const user = await this.prisma.usuario.findUnique({ where: { email } });

    if (!user) {
      throw new HttpException('Credenciais inválidas', HttpStatus.UNAUTHORIZED);
    }

    const isPasswordValid = await bcrypt.compare(senha, user.senha);
    
    if (!isPasswordValid) {
      throw new HttpException('Credenciais inválidas', HttpStatus.UNAUTHORIZED);
    }

    interface JwtPayload {
      id: number;
      nivel_de_acesso: string;
    }
    
    const payload: JwtPayload = { 
      id: user.id, 
      nivel_de_acesso: user.nivel_de_acesso 
    };
    
    const token = this.jwtService.sign(payload);
    
    return {
      message: 'Login realizado com sucesso',
      token,
      nivel_de_acesso: user.nivel_de_acesso,
    };
  }
}