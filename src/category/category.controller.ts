import { Controller, Get, Post, Body } from '@nestjs/common';
import { CategoryService } from './category.service';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async getCategories() {
    return this.categoryService.getAllCategories(); 
  }

  @Post()
  async createCategory(@Body() body: { nome: string; venda_total_dia: number; prateleiraId: number; usuarioId: number }) {
    return this.categoryService.createCategory(body);
  }
}
