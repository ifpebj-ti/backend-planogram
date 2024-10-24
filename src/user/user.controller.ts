// src/user/user.controller.ts

import { Controller, Get, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { NivelDeAcesso } from '@prisma/client'; // Importa o enum

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUsers() {
    return this.userService.getAllUsers();
  }

  @Post()
  async createUser(@Body() body: { nome: string; email: string; senha: string; nivel_de_acesso: NivelDeAcesso }) {
    const nivelDeAcesso = body.nivel_de_acesso; // Agora já está no tipo correto
    return this.userService.createUser({ ...body, nivel_de_acesso: nivelDeAcesso });
  }
}
