// src/category/category.service.ts

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service'; // Ajuste conforme necessário

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  // Método para criar uma categoria
  async createCategory(data: { nome: string; venda_total_dia: number; prateleiraId: number; usuarioId: number }) {
    return this.prisma.categoria.create({
      data: {
        nome: data.nome,
        venda_total_dia: data.venda_total_dia,
        prateleira: {
          connect: {
            id: data.prateleiraId, // Assumindo que você está passando o ID da prateleira
          },
        },
        usuario: {
          connect: {
            id: data.usuarioId, // Assumindo que você está passando o ID do usuário
          },
        },
      },
    });
  }

  // Método para obter todas as categorias
  async getAllCategories() {
    return this.prisma.categoria.findMany({
      include: {
        prateleira: true, // Inclui informações da prateleira, se necessário
        usuario: true, // Inclui informações do usuário, se necessário
      },
    });
  }
}
