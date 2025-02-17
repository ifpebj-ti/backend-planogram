import { Controller, Post, Body, Get, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Categorias')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiOperation({ summary: 'Criar uma nova categoria' })
  @ApiBearerAuth()
  @ApiBody({
    description: 'Dados para criação da categoria',
    schema: {
      type: 'object',
      properties: {
        nome: { type: 'string', example: 'Beleza' },
        venda_total_dia: { type: 'number', example: 1000 },
        prateleiraId: { type: 'number', example: 1 },
        usuarioId: { type: 'number', example: 1 },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Categoria criada com sucesso' })
  @UseGuards(JwtAuthGuard)  
  @Post()
  async createCategory(@Body() body: { nome: string; venda_total_dia: number; prateleiraId: number; usuarioId: number }) {
    return this.categoryService.createCategory(body);
  }

  @ApiOperation({ summary: 'Obter todas as categorias' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Lista de categorias obtida com sucesso' })
  @UseGuards(JwtAuthGuard)  
  @Get()
  async getAll() {
    return this.categoryService.getAllCategories();
  }

  @ApiOperation({ summary: 'Obter categoria por ID' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Categoria encontrada' })
  @ApiResponse({ status: 404, description: 'Categoria não encontrada' })
  @UseGuards(JwtAuthGuard)  
  @Get(':id')
  async getCategoryById(@Param('id') id: string) {
    return this.categoryService.getCategoryById(id);
  }

  @ApiOperation({ summary: 'Atualizar uma categoria' })
  @ApiBearerAuth()
  @ApiBody({
    description: 'Dados para atualização da categoria',
    schema: {
      type: 'object',
      properties: {
        nome: { type: 'string', example: 'Baby' },
        venda_total_dia: { type: 'number', example: 800 },
        prateleiraId: { type: 'number', example: 2 },
        usuarioId: { type: 'number', example: 2 },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Categoria atualizada com sucesso' })
  @ApiResponse({ status: 404, description: 'Categoria não encontrada' })
  @UseGuards(JwtAuthGuard)  
  @Put(':id')
  async updateCategory(
    @Param('id') id: string,
    @Body() body: { nome: string; venda_total_dia: number; prateleiraId?: number; usuarioId?: number }
  ) {
    return this.categoryService.updateCategory(id, body);
  }

  @ApiOperation({ summary: 'Deletar uma categoria' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Categoria deletada com sucesso' })
  @ApiResponse({ status: 404, description: 'Categoria não encontrada' })
  @ApiResponse({ status: 400, description: 'Não é possível excluir a categoria, pois está sendo referenciada por outro registro' })
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteCategory(@Param('id') id: string) {
    return this.categoryService.deleteCategory(id);
  }

  @ApiOperation({ summary: 'Obter quantidade de categorias em uma prateleira' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Quantidade de categorias obtida com sucesso' })
  @UseGuards(JwtAuthGuard)  
  @Get('count/:prateleiraId')
  async getCategoriaQuantidade(){
    return this.categoryService.getCategoriaQuantidade();
  }
}
