import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { NivelDeAcesso } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

const PASSWORD_REGEX = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(data: { nome: string; email: string; senha: string; nivel_de_acesso: NivelDeAcesso }) {
    if (!data.senha) {
      throw new HttpException('Senha não fornecida', HttpStatus.BAD_REQUEST);
    }

    if (!PASSWORD_REGEX.test(data.senha)) {
      throw new HttpException(
        'A senha deve conter pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas e números.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const existingUser = await this.prisma.usuario.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new HttpException('O email fornecido já está em uso.', HttpStatus.BAD_REQUEST);
    }

    const hashedPassword = await bcrypt.hash(data.senha, 12); 

    return this.prisma.usuario.create({
      data: {
        nome: data.nome,
        email: data.email,
        senha: hashedPassword,
        nivel_de_acesso: data.nivel_de_acesso,
      },
    });
  }

  async getUserById(id: string) {
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) throw new HttpException('ID inválido', HttpStatus.BAD_REQUEST);

    const user = await this.prisma.usuario.findUnique({
      where: { id: numericId },
      include: {
        produtos: true,
        categorias: true,
      },
    });

    if (!user) throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);
    return user;
  }

  async updateUser(id: string, data: { nome?: string; email?: string; senha?: string; nivel_de_acesso?: NivelDeAcesso }) {
    const user = await this.getUserById(id);
    if (!user) throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);

    const updateData: { nome?: string; email?: string; senha?: string; nivel_de_acesso?: NivelDeAcesso } = {};

    if (data.nome) updateData.nome = data.nome;
    if (data.email) updateData.email = data.email;
    if (data.nivel_de_acesso) updateData.nivel_de_acesso = data.nivel_de_acesso;

    if (data.senha) {
      if (!PASSWORD_REGEX.test(data.senha)) {
        throw new HttpException(
          'A senha deve conter pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas e números.',
          HttpStatus.BAD_REQUEST,
        );
      }
      updateData.senha = await bcrypt.hash(data.senha, 12);
    }

    return this.prisma.usuario.update({
      where: { id: Number(id) },
      data: updateData,
    });
  }

  async login(email: string, senha: string) {
    if (!email || !senha) {
      throw new HttpException('Email e senha são obrigatórios', HttpStatus.BAD_REQUEST);
    }

    const user = await this.prisma.usuario.findUnique({
      where: { email },
    });

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
      { expiresIn: '1h' },
    );

    return {
      message: 'Login realizado com sucesso',
      token,
      nivel_de_acesso: user.nivel_de_acesso,
    };
  }


  async createUsers(users: { nome: string; email: string; senha: string; nivel_de_acesso: NivelDeAcesso }[]) {
    const createdUsers = [];
    for (const user of users) {
      try {
        const createdUser = await this.createUser(user);
        createdUsers.push(createdUser);
      } catch (error) {
        console.error(`Erro ao criar usuário ${user.nome}: ${error.message}`);
      }
    }
    return createdUsers;
  }

  async getAllUsers() {
    return this.prisma.usuario.findMany({
      include: {
        produtos: true,
        categorias: true,
      },
    });
  }

  async deleteUser(id: string) {
    const user = await this.getUserById(id);
    if (!user) throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);

    try {
      return await this.prisma.usuario.delete({
        where: { id: Number(id) },
      });
    } catch (error) {
      if (error.code === 'P2003') {
        throw new HttpException(
          'Não é possível deletar o usuário pois ele está associado a registros.',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException('Erro ao deletar usuário.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  async recuperarSenha(email: string, novaSenha: string, confirmarSenha: string) {
    if (!novaSenha || !confirmarSenha) {
      throw new HttpException('Ambas as senhas devem ser informadas', HttpStatus.BAD_REQUEST);
    }

    if (novaSenha !== confirmarSenha) {
      throw new HttpException('As senhas não coincidem', HttpStatus.BAD_REQUEST);
    }

    if (!PASSWORD_REGEX.test(novaSenha)) {
      throw new HttpException(
        'A senha deve conter pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas e números.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = await this.prisma.usuario.findUnique({ where: { email } });

    if (!user) {
      throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);
    }

    const senhaCriptografada = await bcrypt.hash(novaSenha, 12);

    await this.prisma.usuario.update({
      where: { email },
      data: { senha: senhaCriptografada },
    });

    return { message: 'Senha redefinida com sucesso' };
  }
}
