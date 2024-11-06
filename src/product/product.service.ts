import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async createProduct(data: { nome: string; id_categoria: number; preco: number; fornecedor: string; venda_por_dia: number; usuarioId: number }) {
    return this.prisma.produto.create({
      data: {
        nome: data.nome,
        id_categoria: data.id_categoria,
        preco: data.preco,
        fornecedor: data.fornecedor,
        venda_por_dia: data.venda_por_dia,
        usuarioId: data.usuarioId,
      },
    });
  }

  async getAllProducts() {
    return this.prisma.produto.findMany({
      include: {
        categoria: true,
        usuario: true,
      },
    });
  }

  async getProductById(id: string) {
    const product = await this.prisma.produto.findUnique({
      where: { id: Number(id) },
    });
    if (!product) {
      throw new Error('Produto não encontrado.');
    }
    return product;
  }

  async updateProduct(id: string, data: { nome: string; id_categoria: number; preco: number; fornecedor: string; venda_por_dia: number; usuarioId: number }) {
    try {
      const product = await this.getProductById(id);
      return this.prisma.produto.update({
        where: { id: product.id },
        data: {
          nome: data.nome,
          id_categoria: data.id_categoria,
          preco: data.preco,
          fornecedor: data.fornecedor,
          venda_por_dia: data.venda_por_dia,
          usuarioId: data.usuarioId,
        },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new Error('Produto não encontrado para atualização.');
      }
      throw error;
    }
  }

  async deleteProduct(id: string) {
    try {
      return await this.prisma.produto.delete({
        where: { id: Number(id) },
      });
    } catch (error) {
      if (error.code === 'P2003') {
        throw new Error('Não é possível excluir o produto, pois ele está sendo referenciado por outro registro.');
      }
      throw error;
    }
  }
}
