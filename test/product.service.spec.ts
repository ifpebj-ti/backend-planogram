import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from '../src/product/product.service'; 
import { PrismaService } from '../src/prisma.service'; 

const mockPrismaService = {
  produto: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('ProductService', () => {
  let service: ProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('createProduct', () => {
    it('deve criar um produto', async () => {
      const productData = {
        nome: 'Produto A',
        id_categoria: 1,
        preco: 100,
        fornecedor: 'Fornecedor A',
        venda_por_dia: 10,
        usuarioId: 1,
      };

      mockPrismaService.produto.create.mockResolvedValue(productData);

      const result = await service.createProduct(productData);

      expect(mockPrismaService.produto.create).toHaveBeenCalledWith({
        data: productData,
      });
      expect(result).toEqual(productData);
    });
  });

  describe('getAllProducts', () => {
    it('deve retornar todos os produtos', async () => {
      const mockProducts = [
        { id: 1, nome: 'Produto A', preco: 100 },
        { id: 2, nome: 'Produto B', preco: 200 },
      ];

      mockPrismaService.produto.findMany.mockResolvedValue(mockProducts);

      const result = await service.getAllProducts();

      expect(mockPrismaService.produto.findMany).toHaveBeenCalledWith({
        include: {
          categoria: true,
          usuario: true,
        },
      });
      expect(result).toEqual(mockProducts);
    });
  });

  describe('getProductById', () => {
    it('deve retornar um produto existente', async () => {
      const mockProduct = { id: 1, nome: 'Produto A', preco: 100 };

      mockPrismaService.produto.findUnique.mockResolvedValue(mockProduct);

      const result = await service.getProductById('1');

      expect(mockPrismaService.produto.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(mockProduct);
    });

    it('deve lançar um erro se o produto não for encontrado', async () => {
      mockPrismaService.produto.findUnique.mockResolvedValue(null);

      await expect(service.getProductById('1')).rejects.toThrow('Produto não encontrado.');
    });
  });

  describe('updateProduct', () => {
    it('deve atualizar um produto existente', async () => {
      const mockProduct = { id: 1, nome: 'Produto A', preco: 100 };
      const updateData = {
        nome: 'Produto Atualizado',
        id_categoria: 1,
        preco: 150,
        fornecedor: 'Fornecedor A',
        venda_por_dia: 10,
        usuarioId: 1,
      };

      mockPrismaService.produto.findUnique.mockResolvedValue(mockProduct);
      mockPrismaService.produto.update.mockResolvedValue({ ...mockProduct, ...updateData });

      const result = await service.updateProduct('1', updateData);

      expect(mockPrismaService.produto.update).toHaveBeenCalledWith({
        where: { id: mockProduct.id },
        data: updateData,
      });
      expect(result).toEqual({ ...mockProduct, ...updateData });
    });

    it('deve lançar um erro se o produto não for encontrado ao atualizar', async () => {
      mockPrismaService.produto.findUnique.mockResolvedValue(null);
      await expect(service.updateProduct('1', { nome: 'Novo Nome', id_categoria: 1, preco: 100, fornecedor: 'Fornecedor A', venda_por_dia: 10, usuarioId: 1 })).rejects.toThrow('Produto não encontrado.');
    });
  });

  describe('deleteProduct', () => {
    it('deve deletar um produto existente', async () => {
      const mockProduct = { id: 1, nome: 'Produto A', preco: 100 };

      mockPrismaService.produto.delete.mockResolvedValue(mockProduct);

      const result = await service.deleteProduct('1');

      expect(mockPrismaService.produto.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(mockProduct);
    });

    it('deve lançar um erro se o produto não for encontrado ao deletar', async () => {
      mockPrismaService.produto.delete.mockRejectedValue({ code: 'P2003' });

      await expect(service.deleteProduct('1')).rejects.toThrow('Não é possível excluir o produto, pois ele está sendo referenciado por outro registro.');
    });
  });
});
