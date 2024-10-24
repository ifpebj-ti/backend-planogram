import { Controller, Post, Body, Get, Param, Put, Delete } from '@nestjs/common';
import { ShelfService } from './shelf.service';

@Controller('shelves')
export class ShelfController {
  constructor(private readonly shelfService: ShelfService) {}

  @Post()
  async create(@Body() createShelfDto: { nome: string }) {
    return this.shelfService.createShelf(createShelfDto);
  }

  @Get()
  async getAll() {
    return this.shelfService.getAllShelves();
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.shelfService.getShelfById(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateShelfDto: { nome: string }) {
    return this.shelfService.updateShelf(id, updateShelfDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.shelfService.deleteShelf(id);
  }
}
