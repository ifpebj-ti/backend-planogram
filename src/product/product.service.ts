import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ImportarPlanilhaService } from './importar-planilha.service'; 

@Injectable()
export class ProductService {
  constructor(
    @Inject(forwardRef(() => ImportarPlanilhaService))  
    private readonly importarPlanilhaService: ImportarPlanilhaService,
    private readonly prisma: PrismaService,  
  ) { }

  async createProduct(data: { nome: string; id_categoria: number; preco: number; fornecedor: string; venda_por_dia: number; usuarioId: number }) {
    const categoria = await this.prisma.categoria.findUnique({
      where: { id: data.id_categoria },
    });
    if (!categoria) {
      throw new Error('Categoria não encontrada');
    }

    const usuario = await this.prisma.usuario.findUnique({
      where: { id: data.usuarioId },
    });
    if (!usuario) {
      throw new Error('Usuário não encontrado');
    }

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
    const productId = parseInt(id); 
    if (isNaN(productId)) {
      throw new Error('ID inválido');
    }
    
    const product = await this.prisma.produto.findUnique({
      where: { id: productId },
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
        throw new Error('Produto não encontrado.');
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