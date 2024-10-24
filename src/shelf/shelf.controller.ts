import { Controller, Post, Body } from '@nestjs/common';
import { ShelfService } from './shelf.service';

@Controller('shelves')
export class ShelfController {
  constructor(private readonly shelfService: ShelfService) {}

  @Post()
  async create(@Body() createShelfDto: { nome: string }) {
    return this.shelfService.createShelf(createShelfDto);
  }

  // Outros métodos, se necessário...
}
