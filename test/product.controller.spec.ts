import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from '../src/product/product.controller';
import { ProductService } from '../src/product/product.service';

const mockProductService = {
  createProduct: jest.fn(),
  getAllProducts: jest.fn(),
  getProductById: jest.fn(),
  updateProduct: jest.fn(),
  deleteProduct: jest.fn(),
};

describe('ProductController', () => {
  let controller: ProductController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        { provide: ProductService, useValue: mockProductService },
      ],
    }).compile();

    controller = module.get<ProductController>(ProductController);
  });

  it('deve estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('deve criar um produto', async () => {
      const createProductDto = {
        nome: 'Produto Teste',
        id_categoria: 1,
        preco: 100.0,
        fornecedor: 'Fornecedor A',
        venda_por_dia: 10,
        usuarioId: 1,
      };

      mockProductService.createProduct.mockResolvedValue(createProductDto);

      const result = await controller.create(createProductDto);

      expect(mockProductService.createProduct).toHaveBeenCalledWith(createProductDto);
      expect(result).toEqual(createProductDto);
    });
  });

  describe('findAll', () => {
    it('deve retornar todos os produtos', async () => {
      const mockProducts = [
        { id: 1, nome: 'Produto A', preco: 50.0 },
        { id: 2, nome: 'Produto B', preco: 75.0 },
      ];

      mockProductService.getAllProducts.mockResolvedValue(mockProducts);

      const result = await controller.findAll();

      expect(mockProductService.getAllProducts).toHaveBeenCalled();
      expect(result).toEqual(mockProducts);
    });
  });

  describe('getById', () => {
    it('deve retornar um produto existente', async () => {
      const mockProduct = { id: 1, nome: 'Produto A', preco: 50.0 };

      mockProductService.getProductById.mockResolvedValue(mockProduct);

      const result = await controller.getById('1');

      expect(mockProductService.getProductById).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockProduct);
    });

    it('deve lançar um erro se o produto não for encontrado', async () => {
      mockProductService.getProductById.mockRejectedValue(new Error('Produto não encontrado.'));

      await expect(controller.getById('1')).rejects.toThrow('Produto não encontrado.');
    });
  });

  describe('update', () => {
    it('deve atualizar um produto existente', async () => {
      const updateProductDto = {
        nome: 'Produto Atualizado',
        id_categoria: 1,
        preco: 120.0,
        fornecedor: 'Fornecedor B',
        venda_por_dia: 5,
        usuarioId: 1,
      };
      const updatedProduct = { id: 1, ...updateProductDto };

      mockProductService.updateProduct.mockResolvedValue(updatedProduct);

      const result = await controller.update('1', updateProductDto);

      expect(mockProductService.updateProduct).toHaveBeenCalledWith('1', updateProductDto);
      expect(result).toEqual(updatedProduct);
    });

    it('deve lançar um erro se o produto não for encontrado ao atualizar', async () => {
      mockProductService.updateProduct.mockRejectedValue(new Error('Produto não encontrado.'));

      await expect(controller.update('1', { nome: 'Novo Nome', id_categoria: 1, preco: 100, fornecedor: 'Fornecedor A', venda_por_dia: 10, usuarioId: 1 })).rejects.toThrow('Produto não encontrado.');
    });
  });

  describe('delete', () => {
    it('deve deletar um produto existente', async () => {
      const mockProduct = { id: 1, nome: 'Produto A' };

      mockProductService.deleteProduct.mockResolvedValue(mockProduct);

      const result = await controller.delete('1');

      expect(mockProductService.deleteProduct).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockProduct);
    });

    it('deve lançar um erro se o produto não for encontrado ao deletar', async () => {
      mockProductService.deleteProduct.mockRejectedValue(new Error('Não é possível excluir o produto, pois ele está sendo referenciado por outro registro.'));

      await expect(controller.delete('1')).rejects.toThrow('Não é possível excluir o produto, pois ele está sendo referenciado por outro registro.');
    });
  });
});
