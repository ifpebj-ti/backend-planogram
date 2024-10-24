import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllCategories() {
    return this.prisma.categoria.findMany({
      include: {
        prateleira: true,
        usuario: true,
      },
    });
  }

  async getCategoryById(id: string) {
    const category = await this.prisma.categoria.findUnique({
      where: { id: Number(id) },
    });
    if (!category) {
      throw new Error('Categoria não encontrada.');
    }
    return category;
  }

  async updateCategory(id: string, data: { nome: string; venda_total_dia: number; prateleiraId: number; usuarioId: number }) {
    try {
      await this.getCategoryById(id);
      return this.prisma.categoria.update({
        where: {
          id: Number(id),
        },
        data: {
          nome: data.nome,
          venda_total_dia: data.venda_total_dia,
          prateleira: {
            connect: {
              id: data.prateleiraId,
            },
          },
          usuario: {
            connect: {
              id: data.usuarioId,
            },
          },
        },
      });
    } catch (error) {
      throw new Error('Categoria não encontrada.');
    }
  }
  
  async createCategory(data: { nome: string; venda_total_dia: number; prateleiraId: number; usuarioId: number }) {
    return this.prisma.categoria.create({
      data: {
        nome: data.nome,
        venda_total_dia: data.venda_total_dia,
        prateleira: {
          connect: {
            id: data.prateleiraId,
          },
        },
        usuario: {
          connect: {
            id: data.usuarioId,
          },
        },
      },
    });
  }
  
  async deleteCategory(id: string) {
    try {
      return await this.prisma.categoria.delete({
        where: { id: Number(id) },
      });
    } catch (error) {
      if (error.code === 'P2003') {
        throw new Error('Não é possível excluir a categoria, pois ela está sendo referenciada por outro registro.');
      }
      throw error;
    }
  }
}
