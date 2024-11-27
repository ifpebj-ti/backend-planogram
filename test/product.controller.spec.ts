import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from '../src/product/product.controller';
import { ProductService } from '../src/product/product.service';
import { PrismaService } from '../src/prisma.service';
import { ImportarPlanilhaService } from '../src/product/importar-planilha.service';

describe('ProductController', () => {
  let productController: ProductController;
  let productService: ProductService;
  let importarPlanilhaService: ImportarPlanilhaService;

  const mockProductService = {
    createProduct: jest.fn(),
    updateProduct: jest.fn(),
    deleteProduct: jest.fn(),
    createProductsFromSheet: jest.fn(),
  };
  

  const mockImportarPlanilhaService = {
    importarPlanilha: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        ProductService,
        { provide: ProductService, useValue: mockProductService },
        PrismaService,
        { provide: ImportarPlanilhaService, useValue: mockImportarPlanilhaService },
      ],
    }).compile();

    productController = module.get<ProductController>(ProductController);
    productService = module.get<ProductService>(ProductService);
    importarPlanilhaService = module.get<ImportarPlanilhaService>(ImportarPlanilhaService);
  });

  it('deve criar um produto', async () => {
    const productData = {
      nome: 'Produto Teste',
      id_categoria: 1,
      preco: 100,
      fornecedor: 'Fornecedor Teste',
      venda_por_dia: 10,
      usuarioId: 1,
    };

    mockProductService.createProduct.mockResolvedValue({ id: 1, ...productData });

    const result = await productController.createProduct(productData);
    expect(mockProductService.createProduct).toHaveBeenCalledWith(productData);
    expect(result).toEqual({ id: 1, ...productData });
  });

  it('deve lançar erro se categoria não for encontrada', async () => {
    const productData = {
      nome: 'Produto Teste',
      id_categoria: 1,
      preco: 100,
      fornecedor: 'Fornecedor Teste',
      venda_por_dia: 10,
      usuarioId: 1,
    };

    mockProductService.createProduct.mockRejectedValue(new Error('Categoria não encontrada'));

    await expect(productController.createProduct(productData)).rejects.toThrow('Categoria não encontrada');
  });

  it('deve lançar erro se usuário não for encontrado', async () => {
    const productData = {
      nome: 'Produto Teste',
      id_categoria: 1,
      preco: 100,
      fornecedor: 'Fornecedor Teste',
      venda_por_dia: 10,
      usuarioId: 1,
    };

    mockProductService.createProduct.mockRejectedValue(new Error('Usuário não encontrado'));

    await expect(productController.createProduct(productData)).rejects.toThrow('Usuário não encontrado');
  });

  it('deve atualizar um produto', async () => {
    const productData = {
      id: 1,
      nome: 'Produto Atualizado',
      id_categoria: 1,
      preco: 150,
      fornecedor: 'Fornecedor Atualizado',
      venda_por_dia: 15,
      usuarioId: 1,
    };

    mockProductService.updateProduct.mockResolvedValue({ id: 1, ...productData });

    const result = await productController.updateProduct('1', productData);
    expect(mockProductService.updateProduct).toHaveBeenCalledWith('1', productData);
    expect(result).toEqual({ id: 1, ...productData });
  });

  it('deve deletar um produto', async () => {
    const productId = '1';
    mockProductService.deleteProduct.mockResolvedValue({ id: productId });

    const result = await productController.deleteProduct(productId);
    expect(mockProductService.deleteProduct).toHaveBeenCalledWith(productId);
    expect(result).toEqual({ id: productId });
  });


  it('deve processar o upload de planilha e criar produtos', async () => {
    const mockFile = { buffer: Buffer.from('mock file') } as Express.Multer.File;
    const mockJson = [{ nome: 'Produto Teste' }];
    const mockResult = [{ id: 1, nome: 'Produto Teste' }];
  
    mockImportarPlanilhaService.importarPlanilha.mockResolvedValue(mockJson);
    mockProductService.createProductsFromSheet.mockResolvedValue(mockResult);
  
    const result = await productController.uploadFile(mockFile);
  
    expect(mockImportarPlanilhaService.importarPlanilha).toHaveBeenCalledWith(mockFile.buffer);
    expect(mockProductService.createProductsFromSheet).toHaveBeenCalledWith(mockJson);
    expect(result).toEqual(mockResult);
  });
  
  
});
