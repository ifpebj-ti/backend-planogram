import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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

  async getCategoryById(id: string): Promise<Categoria> {
    const category = await this.prisma.categoria.findUnique({
      where: { id: Number(id) },
      include: {
        prateleira: true,
        usuario: true,
      },
    });
    if (!category) {
      throw new NotFoundException('Categoria não encontrada.');
    }
    return category;
  }

  async createCategory(data: { nome: string; prateleiraId: number; usuarioId: number; venda_total_dia?: number }) {
    const { nome, prateleiraId, usuarioId, venda_total_dia = 0 } = data;

    if (!prateleiraId || !usuarioId) {
      throw new BadRequestException('Os IDs de prateleira e usuário são obrigatórios.');
    }

    const [prateleiraExiste, usuarioExiste] = await Promise.all([
      this.prisma.prateleira.findUnique({ where: { id: prateleiraId } }),
      this.prisma.usuario.findUnique({ where: { id: usuarioId } }),
    ]);

    if (!prateleiraExiste) {
      throw new NotFoundException('A prateleira informada não existe.');
    }

    if (!usuarioExiste) {
      throw new NotFoundException('O usuário informado não existe.');
    }

    return this.prisma.categoria.create({
      data: {
        nome,
        venda_total_dia,
        prateleira: { connect: { id: prateleiraId } },
        usuario: { connect: { id: usuarioId } },
      },
    });
  }
  
  
  async updateCategory(
    id: string,
    data: { nome: string; venda_total_dia: number; prateleiraId?: number; usuarioId?: number }
  ): Promise<Categoria> {
    if (!data.prateleiraId || !data.usuarioId) {
      throw new BadRequestException('Os IDs de prateleira e usuário são obrigatórios.');
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
      const category = await this.prisma.categoria.findUnique({
        where: { id: Number(id) },
      });

      if (!category) {
        throw new NotFoundException('Categoria não encontrada.');
      }

      return await this.prisma.categoria.delete({ 
        where: { id: Number(id) },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Categoria não encontrada.');
      } else if (error.code === 'P2003') {
        throw new BadRequestException('Não é possível excluir a categoria, pois está sendo referenciada por outro registro.');
      }
      throw error;
    }
  }

  async getCategoriaQuantidade(){
    const count = await this.prisma.categoria.count();
    return{ total: count} 
  }
  
}  