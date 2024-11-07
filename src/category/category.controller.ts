import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Categoria } from './category.service';  
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async getCategories(): Promise<Categoria[]> {
    return this.categoryService.getAllCategories();
  }

  @Get(':id')
  async getCategoryById(@Param('id') id: string): Promise<Categoria | null> {
    return this.categoryService.getCategoryById(id);
  }

  @Post()
  async createCategory(@Body() body: { nome: string; venda_total_dia: number; prateleiraId: number; usuarioId: number }): Promise<Categoria> {
    return this.categoryService.createCategory(body);
  }

  @Put(':id')
  async updateCategory(
    @Param('id') id: string,
    @Body() body: { nome: string; venda_total_dia: number; prateleiraId: number; usuarioId: number }
  ): Promise<Categoria> {
    return this.categoryService.updateCategory(id, body);
  }

  @Delete(':id')
  async deleteCategory(@Param('id') id: string): Promise<void> {
    await this.categoryService.deleteCategory(id);
  }
}
