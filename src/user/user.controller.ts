import { Controller, Post, Get, Put, Delete, Param, Body, UseGuards, HttpCode, HttpStatus } from '@nestjs/common'; 
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { NivelDeAcesso } from '@prisma/client';

@ApiTags('Usuários') 
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Criar um usuário' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiBody({
    description: 'Dados para criação do usuário',
    schema: {
      type: 'object',
      properties: {
        nome: { type: 'string', example: 'Nome Usuario' },
        email: { type: 'string', example: 'emailusuario@teste.com' },
        senha: { type: 'string', example: 'Senha123' },
        nivel_de_acesso: { type: 'string', enum: ['admin', 'common'], example: 'admin' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Usuário criado com sucesso' })
  @Post()
  async createUser(@Body() data: any) {
    return this.userService.createUser(data);
  }

  @ApiOperation({ summary: 'Criar múltiplos usuários' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiBody({
    description: 'Lista de usuários para criação',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          nome: { type: 'string', example: 'Usuário Teste' },
          email: { type: 'string', example: 'teste@teste.com' },
          senha: { type: 'string', example: 'Senha123' },
          nivel_de_acesso: { type: 'string', enum: ['admin', 'common'], example: 'admim' },
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Usuários criados com sucesso' })
  @Post('bulk')
  async createUsers(@Body() users: any) {
    return this.userService.createUsers(users);
  }

  @ApiOperation({ summary: 'Obter todos os usuários' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Lista de usuários obtida com sucesso' })
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllUsers() {
    return this.userService.getAllUsers();
  }

  @ApiOperation({ summary: 'Obter usuário por ID' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Usuário encontrado' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }

  @ApiOperation({ summary: 'Atualizar um usuário' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiBody({
    description: 'Dados para atualização do usuário',
    schema: {
      type: 'object',
      properties: {
        nome: { type: 'string', example: 'Novo Nome' },
        email: { type: 'string', example: 'novoemail@teste.com' },
        senha: { type: 'string', example: 'Senha456' },
        nivel_de_acesso: { type: 'string', enum: ['admin', 'common'], example: 'admim' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Usuário atualizado com sucesso' })
  @Put(':id')
  async updateUser(@Param('id') id: string, @Body() data: any) {
    return this.userService.updateUser(id, data);
  }

  @ApiOperation({ summary: 'Deletar um usuário' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Usuário deletado com sucesso' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }

  @ApiOperation({ summary: 'Login do usuário' })
  @ApiBody({
    description: 'Credenciais do usuário',
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'andressa@teste.com' },
        senha: { type: 'string', example: 'Senha123' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Login bem-sucedido, retorna o token' })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas' })
  @Post('login')
  async login(@Body() data: any) {
    return this.userService.login(data.email, data.senha);
  }

  @ApiOperation({ summary: 'Recuperar senha do usuário' })
  @ApiBody({
    description: 'Dados para redefinição de senha',
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'usuario@teste.com' },
        novaSenha: { type: 'string', example: 'NovaSenha123' },
        confirmarSenha: { type: 'string', example: 'NovaSenha123' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Senha alterada com sucesso' })
  @ApiResponse({ status: 400, description: 'As senhas não coincidem ou não atendem aos requisitos' })
  @ApiResponse({ status: 404, description: 'E-mail não encontrado' })
  @HttpCode(HttpStatus.OK)
  @Post('recuperar-senha')
  async recuperarSenha(@Body() body: { email: string; novaSenha: string; confirmarSenha: string }) {
    return this.userService.recuperarSenha(body.email, body.novaSenha, body.confirmarSenha);
  }
}
