import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from '../src/product/product.service';
import { PrismaService } from '../src/prisma.service';
import { ImportarPlanilhaService } from '../src/product/importar-planilha.service';
import { AuthService } from '../src/auth/auth.service';
import { JwtAuthGuard } from '../src/auth/jwt-auth.guard';

jest.mock('../src/auth/jwt-auth.guard', () => ({
  JwtAuthGuard: jest.fn(() => true),
}));

describe('ProductService', () => {
  let productService: ProductService;
  let prismaService: PrismaService;
  let importarPlanilhaService: ImportarPlanilhaService;

  const mockPrismaService = {
    categoria: { findUnique: jest.fn() },
    usuario: { findUnique: jest.fn() },
    produto: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  const mockImportarPlanilhaService = {
    importarPlanilha: jest.fn(),
  };

  const mockAuthService = {
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: ImportarPlanilhaService, useValue: mockImportarPlanilhaService },
        { provide: AuthService, useValue: mockAuthService },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    productService = module.get<ProductService>(ProductService);
    prismaService = module.get<PrismaService>(PrismaService);
    importarPlanilhaService = module.get<ImportarPlanilhaService>(ImportarPlanilhaService);
  });

  it('deve criar um produto', async () => {
    mockPrismaService.categoria.findUnique.mockResolvedValue({ id: 1 });
    mockPrismaService.usuario.findUnique.mockResolvedValue({ id: 1 });

    const productData = {
      nome: 'Produto Teste',
      id_categoria: 1,
      preco: 100,
      fornecedor: 'Fornecedor Teste',
      venda_por_dia: 10,
      usuarioId: 1,
    };

    await productService.createProduct(productData);
    expect(mockPrismaService.produto.create).toHaveBeenCalledWith({
      data: productData,
    });
  });

  it('deve lançar erro se categoria não for encontrada', async () => {
    mockPrismaService.categoria.findUnique.mockResolvedValue(null);

    const productData = {
      nome: 'Produto Teste',
      id_categoria: 1,
      preco: 100,
      fornecedor: 'Fornecedor Teste',
      venda_por_dia: 10,
      usuarioId: 1,
    };

    await expect(productService.createProduct(productData)).rejects.toThrow('Categoria não encontrada');
  });

  it('deve lançar erro se usuário não for encontrado', async () => {
    mockPrismaService.categoria.findUnique.mockResolvedValue({ id: 1 });
    mockPrismaService.usuario.findUnique.mockResolvedValue(null);

    const productData = {
      nome: 'Produto Teste',
      id_categoria: 1,
      preco: 100,
      fornecedor: 'Fornecedor Teste',
      venda_por_dia: 10,
      usuarioId: 1,
    };

    await expect(productService.createProduct(productData)).rejects.toThrow('Usuário não encontrado');
  });

  it('deve atualizar um produto', async () => {
    mockPrismaService.produto.findUnique.mockResolvedValue({ id: 1 });
    mockPrismaService.produto.update.mockResolvedValue({ id: 1, nome: 'Produto Atualizado' });

    const updatedData = {
      nome: 'Produto Atualizado',
      id_categoria: 1,
      preco: 120,
      fornecedor: 'Fornecedor Atualizado',
      venda_por_dia: 15,
      usuarioId: 1,
    };

    const product = await productService.updateProduct('1', updatedData);
    expect(mockPrismaService.produto.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: updatedData,
    });
    expect(product.nome).toBe('Produto Atualizado');
  });

  it('deve lançar erro se produto não for encontrado para atualização', async () => {
    mockPrismaService.produto.findUnique.mockResolvedValue(null);

    const updatedData = {
      nome: 'Produto Atualizado',
      id_categoria: 1,
      preco: 120,
      fornecedor: 'Fornecedor Atualizado',
      venda_por_dia: 15,
      usuarioId: 1,
    };

    await expect(productService.updateProduct('1', updatedData)).rejects.toThrow('Produto não encontrado');
  });

  it('deve deletar um produto', async () => {
    mockPrismaService.produto.delete.mockResolvedValue({ id: 1 });

    const result = await productService.deleteProduct('1');
    expect(mockPrismaService.produto.delete).toHaveBeenCalledWith({
      where: { id: 1 },
    });
    expect(result).toEqual({ id: 1 });
  });

  it('deve lançar erro se não for possível deletar o produto', async () => {
    mockPrismaService.produto.delete.mockRejectedValue({ code: 'P2003' });

    await expect(productService.deleteProduct('1')).rejects.toThrow('Não é possível excluir o produto, pois ele está sendo referenciado por outro registro.');
  });

  it('deve importar uma planilha e retornar JSON', async () => {
    const mockBuffer = Buffer.from('mock file');
    const mockJson = [{ nome: 'Produto Teste' }];

    mockImportarPlanilhaService.importarPlanilha.mockResolvedValue(mockJson);

    const result = await importarPlanilhaService.importarPlanilha(mockBuffer);

    expect(mockImportarPlanilhaService.importarPlanilha).toHaveBeenCalledWith(mockBuffer);
    expect(result).toEqual(mockJson);
  });

  it('deve lançar erro ao processar planilha inválida', async () => {
    const mockBuffer = Buffer.from('mock file');

    mockImportarPlanilhaService.importarPlanilha.mockRejectedValue(
      new Error('Erro ao processar o arquivo'),
    );

    await expect(importarPlanilhaService.importarPlanilha(mockBuffer)).rejects.toThrow(
      'Erro ao processar o arquivo',
    );
  });
});
