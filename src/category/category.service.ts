import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service'; 

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

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

  async getAllCategories() {
    return this.prisma.categoria.findMany({
      include: {
        prateleira: true, 
        usuario: true, 
      },
    });
  }
}
