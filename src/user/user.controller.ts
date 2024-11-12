import { Controller, Post, Get, Put, Delete, Param, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { NivelDeAcesso } from '@prisma/client';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post('bulk')
  async createUsers(@Body() users: { nome: string; email: string; senha: string; nivel_de_acesso: NivelDeAcesso }[]) {
    return this.userService.createUsers(users);
  }

  @Post()
  async createUser(@Body() data: { nome: string; email: string; senha: string; nivel_de_acesso: NivelDeAcesso }) {
    return this.userService.createUser(data);
  }

  @Get()
  async getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }

  @Put(':id')
  async updateUser(@Param('id') id: string, @Body() data: { nome?: string; email?: string; senha?: string; nivel_de_acesso?: NivelDeAcesso }) {
    return this.userService.updateUser(id, data);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }
}
