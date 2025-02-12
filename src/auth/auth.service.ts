import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

const PASSWORD_REGEX = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

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

  async recuperarSenha(email: string, novaSenha: string, confirmarSenha: string): Promise<{ message: string }> {
    const user = await this.prisma.usuario.findUnique({ where: { email } });

    if (!user) {
      throw new HttpException('E-mail não encontrado', HttpStatus.NOT_FOUND);
    }

    if (novaSenha !== confirmarSenha) {
      throw new HttpException('As senhas não coincidem', HttpStatus.BAD_REQUEST);
    }

    if (!PASSWORD_REGEX.test(novaSenha)) {
      throw new HttpException(
        'A senha deve ter pelo menos 8 caracteres, incluindo uma letra maiúscula, uma minúscula e um número.',
        HttpStatus.BAD_REQUEST
      );
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(novaSenha, saltRounds);

    await this.prisma.usuario.update({
      where: { email },
      data: { senha: hashedPassword },
    });

    return { message: 'Senha alterada com sucesso' };
  }
}