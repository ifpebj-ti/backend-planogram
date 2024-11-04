// __tests__/category.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from '../src/category/category.service'; // Ajuste o caminho conforme necessário
import { PrismaService } from '../src/prisma.service'; // Ajuste o caminho conforme necessário

const mockPrismaService = {
  categoria: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
  },
};

describe('CategoryService', () => {
  let service: CategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('getAllCategories', () => {
    it('deve retornar todas as categorias', async () => {
      const mockCategories = [
        { id: 1, nome: 'Categoria A', venda_total_dia: 100 },
        { id: 2, nome: 'Categoria B', venda_total_dia: 200 },
      ];

      mockPrismaService.categoria.findMany.mockResolvedValue(mockCategories);

      const result = await service.getAllCategories();

      expect(mockPrismaService.categoria.findMany).toHaveBeenCalledWith({
        include: {
          prateleira: true,
          usuario: true,
        },
      });
      expect(result).toEqual(mockCategories);
    });
  });

  describe('getCategoryById', () => {
    it('deve retornar uma categoria existente', async () => {
      const mockCategory = { id: 1, nome: 'Categoria A', venda_total_dia: 100 };

      mockPrismaService.categoria.findUnique.mockResolvedValue(mockCategory);

      const result = await service.getCategoryById('1');

      expect(mockPrismaService.categoria.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(mockCategory);
    });

    it('deve lançar um erro se a categoria não for encontrada', async () => {
      mockPrismaService.categoria.findUnique.mockResolvedValue(null);

      await expect(service.getCategoryById('1')).rejects.toThrow('Categoria não encontrada.');
    });
  });

  describe('updateCategory', () => {
    it('deve atualizar uma categoria existente', async () => {
      const mockCategory = { id: 1, nome: 'Categoria A', venda_total_dia: 100 };
      const updateData = {
        nome: 'Categoria Atualizada',
        venda_total_dia: 150,
        prateleiraId: 1,
        usuarioId: 1,
      };

      mockPrismaService.categoria.findUnique.mockResolvedValue(mockCategory);
      mockPrismaService.categoria.update.mockResolvedValue({ ...mockCategory, ...updateData });

      const result = await service.updateCategory('1', updateData);

      expect(mockPrismaService.categoria.update).toHaveBeenCalledWith({
        where: { id: mockCategory.id },
        data: {
          nome: updateData.nome,
          venda_total_dia: updateData.venda_total_dia,
          prateleira: { connect: { id: updateData.prateleiraId } },
          usuario: { connect: { id: updateData.usuarioId } },
        },
      });
      expect(result).toEqual({ ...mockCategory, ...updateData });
    });

    it('deve lançar um erro se a categoria não for encontrada ao atualizar', async () => {
      mockPrismaService.categoria.findUnique.mockResolvedValue(null);

      await expect(service.updateCategory('1', { nome: 'Novo Nome', venda_total_dia: 100, prateleiraId: 1, usuarioId: 1 })).rejects.toThrow('Categoria não encontrada.');
    });
  });

  describe('createCategory', () => {
    it('deve criar uma nova categoria', async () => {
      const categoryData = {
        nome: 'Nova Categoria',
        venda_total_dia: 200,
        prateleiraId: 1,
        usuarioId: 1,
      };

      mockPrismaService.categoria.create.mockResolvedValue(categoryData);

      const result = await service.createCategory(categoryData);

      expect(mockPrismaService.categoria.create).toHaveBeenCalledWith({
        data: {
          nome: categoryData.nome,
          venda_total_dia: categoryData.venda_total_dia,
          prateleira: { connect: { id: categoryData.prateleiraId } },
          usuario: { connect: { id: categoryData.usuarioId } },
        },
      });
      expect(result).toEqual(categoryData);
    });
  });

  describe('deleteCategory', () => {
    it('deve deletar uma categoria existente', async () => {
      const mockCategory = { id: 1, nome: 'Categoria A', venda_total_dia: 100 };

      mockPrismaService.categoria.delete.mockResolvedValue(mockCategory);

      const result = await service.deleteCategory('1');

      expect(mockPrismaService.categoria.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(mockCategory);
    });

    it('deve lançar um erro se a categoria não for encontrada ao deletar', async () => {
      mockPrismaService.categoria.delete.mockRejectedValue({ code: 'P2003' });

      await expect(service.deleteCategory('1')).rejects.toThrow('Não é possível excluir a categoria, pois ela está sendo referenciada por outro registro.');
    });
  });
});
