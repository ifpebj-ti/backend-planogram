import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from '../src/category/category.service';
import { PrismaService } from '../src/prisma.service';

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
        include: {
          prateleira: true,
          usuario: true,
        },
      });
      expect(result).toEqual({ ...mockCategory, ...updateData });
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
        include: {
          prateleira: true,
          usuario: true,
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
  
    it('deve lançar um erro se a categoria estiver sendo referenciada por outro registro', async () => {
      const foreignKeyError = { code: 'P2003', message: 'Restrição de chave estrangeira' };
      
      mockPrismaService.categoria.delete.mockRejectedValue(foreignKeyError);
      
      await expect(service.deleteCategory('1')).rejects.toThrow(
        'Não é possível excluir a categoria, pois ela está sendo referenciada por outro registro.'
      );
    });
  });
});