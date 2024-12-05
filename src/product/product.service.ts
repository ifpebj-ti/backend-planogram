import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async createProduct(data: {
    nome: string;
    id_categoria: number;
    preco: number;
    fornecedor: string;
    venda_por_dia: number;
    usuarioId: number;
  }) {
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

  async createProductsFromSheet(dataArray: any[]) {
    const createdProducts = [];

    for (const data of dataArray) {
      const newProduct = await this.createProduct({
        nome: data.nome,
        id_categoria: data.id_categoria,
        preco: data.preco,
        fornecedor: data.fornecedor,
        venda_por_dia: data.venda_por_dia,
        usuarioId: data.usuarioId,
      });
      createdProducts.push(newProduct);
    }

    return createdProducts;
  }

  async getAllProducts() {
    return this.prisma.produto.findMany({
      include: {
        categoria: true,
        usuario: true,
      },
    });
  }

  async getProductById(id: number) {  
    if (!id || isNaN(id)) {
      throw new Error('ID inválido');
    }
  
    const product = await this.prisma.produto.findUnique({
      where: { id },
    });
  
    if (!product) {
      throw new Error('Produto não encontrado');
    }
  
    return product;
  }
  
  
  
  async updateProduct(
    id: string,
    data: {
      nome: string;
      id_categoria: number;
      preco: number;
      fornecedor: string;
      venda_por_dia: number;
      usuarioId: number;
    },
  ) {
    const productId = Number(id);
  
    if (isNaN(productId)) {
      throw new Error('ID inválido');
    }
  
    const product = await this.getProductById(productId);
  
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
  }
  


  async deleteProduct(productId: string): Promise<any> {
    try {
      return await this.prisma.produto.delete({
        where: { id: Number(productId) },
      });
    } catch (error) {
      if (error.code === 'P2003') {
        throw new Error('Não é possível excluir o produto, pois ele está sendo referenciado por outro registro.');
      }
      throw error;
    }
  }

async getMostPurchasedProducts() {
  return this.prisma.produto.findMany({
    orderBy: {
      venda_por_dia: 'desc', 
    },
    take: 10, 
  });
}

async getLeastPurchasedProducts() {
  return this.prisma.produto.findMany({
    orderBy: {
      venda_por_dia: 'asc', 
    },
    take: 10, 
  });
}

async getTotalProducts() {
  const count = await this.prisma.produto.count();
  return { total: count }; 
}


}
