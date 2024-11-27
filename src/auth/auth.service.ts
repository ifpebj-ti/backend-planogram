import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async login(email: string, senha: string) {
    const user = await this.prisma.usuario.findUnique({ where: { email } });

    if (!user) {
      throw new HttpException('Credenciais inválidas', HttpStatus.UNAUTHORIZED);
    }

    const isPasswordValid = await bcrypt.compare(senha, user.senha);
    
    if (!isPasswordValid) {
      throw new HttpException('Credenciais inválidas', HttpStatus.UNAUTHORIZED);
    }

    const token = jwt.sign(
      { id: user.id, nivel_de_acesso: user.nivel_de_acesso },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1h' }
    );

    return {
      message: 'Login realizado com sucesso',
      token,
      nivel_de_acesso: user.nivel_de_acesso,
    };
  }
}
