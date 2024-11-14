import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { NivelDeAcesso } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) { }

  async createUser(data: { nome: string; email: string; senha: string; nivel_de_acesso: NivelDeAcesso }) {
    if (!data.senha) {
      throw new Error('Senha não fornecida');
    }
  
    const existingUser = await this.prisma.usuario.findUnique({
      where: { email: data.email },
    });
  
    if (existingUser) {
      throw new Error('O email fornecido já está em uso.');
    }
  
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

  async getUserById(id: string) {
    const numericId = Number(id); 
    if (isNaN(numericId)) throw new Error('ID inválido');

    const user = await this.prisma.usuario.findUnique({
      where: { id: numericId },
      include: {
        produtos: true,
        categorias: true,
      },
    });

    if (!user) throw new Error('Usuário não encontrado');
    return user;
  }

  async deleteUser(id: string) {
    const user = await this.getUserById(id);
    if (!user) throw new Error('Usuário não encontrado');

    try {
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

  async updateUser(id: string, data: { nome?: string; email?: string; senha?: string; nivel_de_acesso?: NivelDeAcesso }) {
    const user = await this.getUserById(id);
    if (!user) throw new Error('Usuário não encontrado');

    const updateData: { nome?: string; email?: string; senha?: string; nivel_de_acesso?: NivelDeAcesso } = {};

    if (data.nome) updateData.nome = data.nome;
    if (data.email) updateData.email = data.email;
    if (data.nivel_de_acesso) updateData.nivel_de_acesso = data.nivel_de_acesso;
    if (data.senha) {
      updateData.senha = await bcrypt.hash(data.senha, 10); 
    }

    try {
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
