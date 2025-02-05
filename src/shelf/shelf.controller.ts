import { Controller, Post, Body, Get, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { ShelfService } from './shelf.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Prateleiras')
@Controller('shelves')
export class ShelfController {
  constructor(private readonly shelfService: ShelfService) {}

  @ApiOperation({ summary: 'Criar uma nova prateleira' })
  @ApiBearerAuth()
  @ApiBody({
    description: 'Dados para criação da prateleira',
    schema: {
      type: 'object',
      properties: {
        nome: { type: 'string', example: 'Prateleira A' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Prateleira criada com sucesso' })
  @UseGuards(JwtAuthGuard)  
  @Post()
  async create(@Body() createShelfDto: { nome: string }) {
    return this.shelfService.createShelf(createShelfDto);
  }

  @ApiOperation({ summary: 'Obter todas as prateleiras' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Lista de prateleiras obtida com sucesso' })
  @UseGuards(JwtAuthGuard)  
  @Get()
  async getAll() {
    return this.shelfService.getAllShelves();
  }

  @ApiOperation({ summary: 'Obter prateleira por ID' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Prateleira encontrada' })
  @ApiResponse({ status: 404, description: 'Prateleira não encontrada' })
  @UseGuards(JwtAuthGuard)  
  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.shelfService.getShelfById(id);
  }

  @ApiOperation({ summary: 'Atualizar uma prateleira' })
  @ApiBearerAuth()
  @ApiBody({
    description: 'Dados para atualização da prateleira',
    schema: {
      type: 'object',
      properties: {
        nome: { type: 'string', example: 'Prateleira Atualizada' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Prateleira atualizada com sucesso' })
  @ApiResponse({ status: 404, description: 'Prateleira não encontrada' })
  @UseGuards(JwtAuthGuard)  
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateShelfDto: { nome: string }) {
    return this.shelfService.updateShelf(id, updateShelfDto);
  }

  @ApiOperation({ summary: 'Deletar uma prateleira' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Prateleira deletada com sucesso' })
  @ApiResponse({ status: 404, description: 'Prateleira não encontrada' })
  @UseGuards(JwtAuthGuard)  
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.shelfService.deleteShelf(id);
  }
}
