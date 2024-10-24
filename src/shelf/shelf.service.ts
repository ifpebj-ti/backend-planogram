import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ShelfService {
  constructor(private readonly prisma: PrismaService) {}

  async createShelf(data: { nome: string }) {
    return this.prisma.prateleira.create({
      data: {
        nome: data.nome,
      },
    });
  }

  async getAllShelves() {
    return this.prisma.prateleira.findMany();
  }

  async getShelfById(id: string) {
    try {
      const shelf = await this.prisma.prateleira.findUnique({
        where: { id: Number(id) },
      });

      if (!shelf) {
        throw new Error('Prateleira não encontrada');
      }

      return shelf;
    } catch (error) {
      throw new Error(`Erro ao buscar prateleira: ${error.message}`);
    }
  }

  async updateShelf(id: string, data: { nome: string }) {
    try {
      const shelf = await this.getShelfById(id);
      if (!shelf) {
        throw new Error('Prateleira não encontrada');
      }

      return await this.prisma.prateleira.update({
        where: { id: Number(id) },
        data: {
          nome: data.nome,
        },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new Error('Não foi possível atualizar, prateleira não encontrada.');
      }

      throw new Error(`Erro ao atualizar prateleira: ${error.message}`);
    }
  }

  async deleteShelf(id: string) {
    try {
      const shelf = await this.getShelfById(id);
      if (!shelf) {
        throw new Error('Prateleira não encontrada');
      }

      return await this.prisma.prateleira.delete({
        where: { id: Number(id) },
      });
    } catch (error) {
      if (error.code === 'P2003') {
        throw new Error('Não é possível excluir a prateleira, pois ela está sendo referenciada por outro registro.');
      }

      throw new Error(`Erro ao deletar prateleira: ${error.message}`);
    }
  }
}
