import { Test, TestingModule } from '@nestjs/testing';
import { CategoryController } from '../src/category/category.controller';
import { CategoryService } from '../src/category/category.service';
import { AuthService } from '../src/auth/auth.service';
import { JwtAuthGuard } from '../src/auth/jwt-auth.guard';

jest.mock('../src/auth/jwt-auth.guard', () => ({
  JwtAuthGuard: jest.fn(() => true),
}));

const mockCategoryService = {
  getAllCategories: jest.fn(),
  getCategoryById: jest.fn(),
  updateCategory: jest.fn(),
  createCategory: jest.fn(),
  deleteCategory: jest.fn(),
};

const mockAuthService = {
  login: jest.fn(),
};

describe('CategoryController', () => {
  let controller: CategoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryController],
      providers: [
        { provide: CategoryService, useValue: mockCategoryService },
        { provide: AuthService, useValue: mockAuthService },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<CategoryController>(CategoryController);
  });

  it('deve estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllCategories', () => {
    it('deve retornar todas as categorias', async () => {
      const mockCategories = [{ id: 1, nome: 'Categoria A' }, { id: 2, nome: 'Categoria B' }];
      mockCategoryService.getAllCategories.mockResolvedValue(mockCategories);

      const result = await controller.getAll();
      expect(mockCategoryService.getAllCategories).toHaveBeenCalled();
      expect(result).toEqual(mockCategories);
    });
  });

  describe('getCategoryById', () => {
    it('deve retornar uma categoria existente', async () => {
      const mockCategory = { id: 1, nome: 'Categoria A' };
      mockCategoryService.getCategoryById.mockResolvedValue(mockCategory);

      const result = await controller.getCategoryById('1');
      expect(mockCategoryService.getCategoryById).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockCategory);
    });

    it('deve lançar erro se categoria não for encontrada', async () => {
      mockCategoryService.getCategoryById.mockRejectedValue(new Error('Categoria não encontrada.'));
      await expect(controller.getCategoryById('1')).rejects.toThrow('Categoria não encontrada.');
    });
  });

  describe('updateCategory', () => {
    it('deve atualizar uma categoria', async () => {
      const updateData = {
        nome: 'Categoria Atualizada',
        venda_total_dia: 250,
        prateleiraId: 2,
        usuarioId: 3
      };
      const updatedCategory = { id: 1, ...updateData };
      mockCategoryService.updateCategory.mockResolvedValue(updatedCategory);

      const result = await controller.updateCategory('1', updateData);
      expect(mockCategoryService.updateCategory).toHaveBeenCalledWith('1', updateData);
      expect(result).toEqual(updatedCategory);
    });

    it('deve lançar erro ao atualizar categoria não encontrada', async () => {
      mockCategoryService.updateCategory.mockRejectedValue(new Error('Categoria não encontrada.'));
      await expect(controller.updateCategory('1', { nome: 'Novo Nome', venda_total_dia: 150, prateleiraId: 2, usuarioId: 3 }))
        .rejects.toThrow('Categoria não encontrada.');
    });
  });


  describe('createCategory', () => {
    it('deve criar uma nova categoria', async () => {
      const categoryData = { nome: 'Nova Categoria', venda_total_dia: 200, prateleiraId: 1, usuarioId: 1 };
      mockCategoryService.createCategory.mockResolvedValue(categoryData);

      const result = await controller.createCategory(categoryData);
      expect(mockCategoryService.createCategory).toHaveBeenCalledWith(categoryData);
      expect(result).toEqual(categoryData);
    });
  });

  describe('deleteCategory', () => {
    it('deve deletar uma categoria', async () => {
      mockCategoryService.deleteCategory.mockResolvedValue(undefined);
      const result = await controller.deleteCategory('1');
      expect(mockCategoryService.deleteCategory).toHaveBeenCalledWith('1');
      expect(result).toBeUndefined();
    });

    it('deve lançar erro ao deletar categoria não encontrada', async () => {
      mockCategoryService.deleteCategory.mockRejectedValue(new Error('Não é possível excluir a categoria, pois ela está sendo referenciada por outro registro.'));
      await expect(controller.deleteCategory('1')).rejects.toThrow('Não é possível excluir a categoria, pois ela está sendo referenciada por outro registro.');
    });
  });
});
