import { Controller, Post, Body, Get, Param, Put, Delete, UploadedFile, UseInterceptors, BadRequestException, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { ProductService } from './product.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImportarPlanilhaService } from './importar-planilha.service';
import { Express } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Produtos')
@Controller('produtos')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly importarPlanilhaService: ImportarPlanilhaService,
  ) {}

  @ApiOperation({ summary: 'Criar um novo produto' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiBody({
    description: 'Dados para criação do produto',
    schema: {
      type: 'object',
      properties: {
        nome: { type: 'string', example: 'Produto Exemplo' },
        id_categoria: { type: 'number', example: 1 },
        preco: { type: 'number', example: 100.5 },
        fornecedor: { type: 'string', example: 'Fornecedor A' },
        venda_por_dia: { type: 'number', example: 10 },
        usuarioId: { type: 'number', example: 1 },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Produto criado com sucesso' })
  @Post()
  async createProduct(@Body() createProductDto: { nome: string; id_categoria: number; preco: number; fornecedor: string; venda_por_dia: number; usuarioId: number }) {
    return this.productService.createProduct(createProductDto);
  }

  @ApiOperation({ summary: 'Obter todos os produtos' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, description: 'Lista de produtos obtida com sucesso' })
  @Get()
  async findAll() {
    return this.productService.getAllProducts();
  }

  @ApiOperation({ summary: 'Obter produto por ID' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, description: 'Produto encontrado' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  @Get(':id(\\d+)')
  async getProductById(@Param('id', ParseIntPipe) id: number) {
    return this.productService.getProductById(id);
  }

  @ApiOperation({ summary: 'Atualizar um produto' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiBody({
    description: 'Dados para atualização do produto',
    schema: {
      type: 'object',
      properties: {
        nome: { type: 'string', example: 'Produto Atualizado' },
        id_categoria: { type: 'number', example: 2 },
        preco: { type: 'number', example: 120.5 },
        fornecedor: { type: 'string', example: 'Fornecedor B' },
        venda_por_dia: { type: 'number', example: 15 },
        usuarioId: { type: 'number', example: 1 },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Produto atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  @Put(':id')
  async updateProduct(@Param('id') id: string, @Body() updateProductDto: { nome: string; id_categoria: number; preco: number; fornecedor: string; venda_por_dia: number; usuarioId: number }) {
    return this.productService.updateProduct(id, updateProductDto);
  }

  @ApiOperation({ summary: 'Deletar um produto' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, description: 'Produto deletado com sucesso' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  @Delete(':id')
  async deleteProduct(@Param('id') id: string) {
    return this.productService.deleteProduct(id);
  }

  @ApiOperation({ summary: 'Upload de planilha de produtos' })
  @ApiConsumes('multipart/form-data') 
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 201, description: 'Planilha importada com sucesso' })
  @Post('upload-planilha')
  @UseInterceptors(FileInterceptor('planilha'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Nenhum arquivo enviado');
    }
  
    try {
      const jsonData = await this.importarPlanilhaService.importarPlanilha(file.buffer);
      return this.productService.createProductsFromSheet(jsonData);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @ApiOperation({ summary: 'Obter produtos mais comprados' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, description: 'Lista de produtos mais comprados' })
  @Get('mais-comprados')
  async getMostPurchasedProducts() {
    return this.productService.getMostPurchasedProducts();
  }

  @ApiOperation({ summary: 'Obter produtos menos comprados' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, description: 'Lista de produtos menos comprados' })
  @Get('menos-comprados')
  async getLeastPurchasedProducts() {
    return this.productService.getLeastPurchasedProducts();
  }

  @ApiOperation({ summary: 'Obter o total de produtos' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, description: 'Total de produtos' })
  @Get('total')
  async getTotalProducts() {
    return this.productService.getTotalProducts();
  }
}
