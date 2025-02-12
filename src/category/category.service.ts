import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

export interface Categoria {
  id: number;
  nome: string;
  venda_total_dia: number;
  prateleira: Prateleira;
  usuario: Usuario;
}

interface Prateleira {
  id: number;
  nome: string;
}

interface Usuario {
  id: number;
  nome: string;
}

@Injectable()
export class CategoryService {
  prismaService: PrismaService;
  constructor(private readonly prisma: PrismaService) {}

  async getAllCategories(): Promise<Categoria[]> {
    return this.prisma.categoria.findMany({
      include: {
        prateleira: true,
        usuario: true,
      },
    });
  }

  async getCategoryById(id: string): Promise<Categoria | null> {
    const category = await this.prisma.categoria.findUnique({
      where: { id: Number(id) },
      include: {
        prateleira: true,
        usuario: true,
      },
    });
    if (!category) {
      throw new Error('Categoria não encontrada.');
    }
    return category;
  }

  async createCategory(
    data: { nome: string; venda_total_dia: number; prateleiraId?: number; usuarioId?: number }
  ): Promise<Categoria> {
    if (!data.prateleiraId || !data.usuarioId) {
      throw new Error('Os IDs de prateleira e usuário são obrigatórios.');
    }
  
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
      include: {
        prateleira: true,
        usuario: true,
      },
    });
  }
  
  async updateCategory(
    id: string,
    data: { nome: string; venda_total_dia: number; prateleiraId?: number; usuarioId?: number }
  ): Promise<Categoria> {
    if (!data.prateleiraId || !data.usuarioId) {
      throw new Error('Os IDs de prateleira e usuário são obrigatórios.');
    }
  
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
      include: {
        prateleira: true,
        usuario: true,
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

  async getCategoriaQuantidade(){
    const count = await this.prisma.categoria.count();
    return{ total: count} 
  }
  
}  