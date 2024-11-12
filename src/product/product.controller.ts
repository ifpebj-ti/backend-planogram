import { Controller, Post, Body, Get, Param, Put, Delete, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { ProductService } from './product.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImportarPlanilhaService } from '../product/importar-planilha.service';
import { Express } from 'express'; 

@Controller('produtos')
export class ProductController {
  [x: string]: any;
  constructor(
    private readonly productService: ProductService,
    private readonly importarPlanilhaService: ImportarPlanilhaService
  ) {}

  @Post()
  async createProduct(@Body() createProductDto: { nome: string; id_categoria: number; preco: number; fornecedor: string; venda_por_dia: number; usuarioId: number }) {
    return this.productService.createProduct(createProductDto);
  }

  @Get()
  async findAll() {
    return this.productService.getAllProducts();
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.productService.getProductById(id);
  }

  @Put(':id')
  async updateProduct(@Param('id') id: string, @Body() updateProductDto: { nome: string; id_categoria: number; preco: number; fornecedor: string; venda_por_dia: number; usuarioId: number }) {
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

    const filePath = file.path; 

    try {
      const result = await this.importarPlanilhaService.importarPlanilha(filePath);
      return result;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
