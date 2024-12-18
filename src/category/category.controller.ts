import { Controller, Post, Body, Get, Param, Put, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { Categoria } from './category.service';  

@ApiTags('Categorias')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiOperation({ summary: 'Criar uma nova categoria' })
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
  @Post()
  async createCategory(@Body() body: { nome: string; venda_total_dia: number; prateleiraId: number; usuarioId: number }) {
    return this.categoryService.createCategory(body);
  }

  @ApiOperation({ summary: 'Obter todas as categorias' })
  @ApiResponse({ status: 200, description: 'Lista de categorias obtida com sucesso' })
  @Get()
  async getAll() {
    return this.categoryService.getAllCategories();
  }

  @ApiOperation({ summary: 'Obter categoria por ID' })
  @ApiResponse({ status: 200, description: 'Categoria encontrada' })
  @ApiResponse({ status: 404, description: 'Categoria não encontrada' })
  @Get(':id')
  async getCategoryById(@Param('id') id: string) {
    return this.categoryService.getCategoryById(id);
  }

  @ApiOperation({ summary: 'Atualizar uma categoria' })
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
  @Put(':id')
  async updateCategory(
    @Param('id') id: string,
    @Body() body: { nome: string; venda_total_dia: number; prateleiraId: number; usuarioId: number }
  ) {
    return this.categoryService.updateCategory(id, body);
  }

  @ApiOperation({ summary: 'Deletar uma categoria' })
  @ApiResponse({ status: 200, description: 'Categoria deletada com sucesso' })
  @ApiResponse({ status: 404, description: 'Categoria não encontrada' })
  @Delete(':id')
  async deleteCategory(@Param('id') id: string) {
    return this.categoryService.deleteCategory(id);
  }
}
