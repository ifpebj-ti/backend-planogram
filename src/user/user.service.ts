import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { NivelDeAcesso } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(data: { nome: string; email: string; senha: string; nivel_de_acesso: NivelDeAcesso }) {
    const hashedPassword = await bcrypt.hash(data.senha, 10);
    return this.prisma.usuario.create({
      data: {
        nome: data.nome,
        email: data.email,
        senha: hashedPassword,
        nivel_de_acesso: data.nivel_de_acesso,
      },
    });
  }

  async createUsers(users: Array<{ nome: string; email: string; senha: string; nivel_de_acesso: NivelDeAcesso }>) {
    const userCreationPromises = users.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.senha, 10);
      return this.createUser({ ...user, senha: hashedPassword });
    });
    return Promise.all(userCreationPromises);
  }

  async getAllUsers() {
    return this.prisma.usuario.findMany({
      include: {
        produtos: true,
        categorias: true,
      },
    });
  }

  async getUserById(id: string) {
    try {
      const user = await this.prisma.usuario.findUnique({
        where: { id: Number(id) },
        include: {
          produtos: true,
          categorias: true,
        },
      });

      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      return user;
    } catch (error) {
      throw new Error(`Erro ao buscar usuário: ${error.message}`);
    }
  }

  async deleteUser(id: string) {
    try {
      const user = await this.getUserById(id);
      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      return await this.prisma.usuario.delete({
        where: { id: Number(id) },
      });
    } catch (error) {
      if (error.code === 'P2003') {
        throw new Error('Não é possível deletar o usuário, pois ele está associado a outros registros.');
      }

      throw new Error(`Erro ao deletar usuário: ${error.message}`);
    }
  }

  async updateUser(id: string, data: { nome?: string; email?: string; nivel_de_acesso?: NivelDeAcesso }) {
    try {
      const user = await this.getUserById(id);
      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      const updateData: any = {};
      if (data.nome) updateData.nome = data.nome;
      if (data.email) updateData.email = data.email;
      if (data.nivel_de_acesso) updateData.nivel_de_acesso = data.nivel_de_acesso;

      return await this.prisma.usuario.update({
        where: { id: Number(id) },
        data: updateData,
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new Error('Não foi possível atualizar, usuário não encontrado.');
      }

      throw new Error(`Erro ao atualizar usuário: ${error.message}`);
    }
  }
}
