import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { CategoryService } from './category.service';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async getCategories() {
    return this.categoryService.getAllCategories();
  }

  @Get(':id')
  async getCategoryById(@Param('id') id: string) {
    return this.categoryService.getCategoryById(id);
  }

  @Post()
  async createCategory(@Body() body: { nome: string; venda_total_dia: number; prateleiraId: number; usuarioId: number }) {
    return this.categoryService.createCategory(body);
  }

  @Put(':id')
  async updateCategory(@Param('id') id: string, @Body() body: { nome: string; venda_total_dia: number; prateleiraId: number; usuarioId: number }) {
    return this.categoryService.updateCategory(id, body);
  }

  @Delete(':id')
  async deleteCategory(@Param('id') id: string) {
    return this.categoryService.deleteCategory(id);
  }
}
