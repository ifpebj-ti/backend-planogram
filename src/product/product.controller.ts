import { Controller, Post, Body, Get, Param, Put, Delete, UploadedFile, UseInterceptors, BadRequestException, ParseIntPipe } from '@nestjs/common';
import { ProductService } from './product.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImportarPlanilhaService } from './importar-planilha.service';
import { Express } from 'express';

@Controller('produtos')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly importarPlanilhaService: ImportarPlanilhaService,
  ) { }

  @Post()
  async createProduct(
    @Body()
    createProductDto: {
      nome: string;
      id_categoria: number;
      preco: number;
      fornecedor: string;
      venda_por_dia: number;
      usuarioId: number;
    },
  ) {
    return this.productService.createProduct(createProductDto);
  }

  @Get()
  async findAll() {
    return this.productService.getAllProducts();
  }

  @Get(':id(\\d+)')
  async getProductById(@Param('id', ParseIntPipe) id: number) {
    return this.productService.getProductById(id);
  }


  @Put(':id')
  async updateProduct(
    @Param('id') id: string,
    @Body()
    updateProductDto: {
      nome: string;
      id_categoria: number;
      preco: number;
      fornecedor: string;
      venda_por_dia: number;
      usuarioId: number;
    },
  ) {
    return this.productService.updateProduct(id, updateProductDto);
  }

  @Delete(':id')
  async deleteProduct(@Param('id') id: string) {
    return this.productService.deleteProduct(id);
  }

  @Post('upload-planilha')
  @UseInterceptors(FileInterceptor('planilha'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Nenhum arquivo enviado');
    }

    try {
      const jsonData = await this.importarPlanilhaService.importarPlanilha(file.buffer);

      const result = await this.productService.createProductsFromSheet(jsonData);
      return result;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('mais-comprados')
  async getMostPurchasedProducts() {
    return this.productService.getMostPurchasedProducts();
  }

  @Get('menos-comprados')
  async getLeastPurchasedProducts() {
    return this.productService.getLeastPurchasedProducts();
  }


  @Get('total')
  async getTotalProducts() {
    return this.productService.getTotalProducts();
  }
}
