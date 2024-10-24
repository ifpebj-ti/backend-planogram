// src/user/user.service.ts

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service'; // Ajuste conforme necessário
import { NivelDeAcesso } from '@prisma/client'; // Ajuste se necessário
import * as bcrypt from 'bcrypt'; // Importa a biblioteca bcrypt

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(data: { nome: string; email: string; senha: string; nivel_de_acesso: NivelDeAcesso }) {
    // Criptografa a senha
    const hashedPassword = await bcrypt.hash(data.senha, 10); // O número 10 é o fator de custo

    return this.prisma.usuario.create({
      data: {
        nome: data.nome,
        email: data.email,
        senha: hashedPassword, // Armazena a senha criptografada
        nivel_de_acesso: data.nivel_de_acesso, // Certifique-se de que o tipo de `nivel_de_acesso` esteja correto
      }
    });
  }

  // Método para criar múltiplos usuários (opcional)
  async createUsers(users: Array<{ nome: string; email: string; senha: string; nivel_de_acesso: NivelDeAcesso }>) {
    const userCreationPromises = users.map(async user => {
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
}
