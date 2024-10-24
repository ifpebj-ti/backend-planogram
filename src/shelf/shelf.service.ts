import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ShelfService {
  constructor(private readonly prisma: PrismaService) {}

  async createShelf(data: { nome: string }) {
    return this.prisma.prateleira.create({
      data: {
        nome: data.nome, // Certifique-se de que está passando o nome corretamente
      },
    });
  }

  async findAll() {
    return this.prisma.prateleira.findMany();
  }

  // Outros métodos, se necessário...
}
