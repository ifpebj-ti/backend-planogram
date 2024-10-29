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
}
