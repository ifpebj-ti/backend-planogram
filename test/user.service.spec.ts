// __tests__/user.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../src/user/user.service'; // Ajuste o caminho conforme necessário
import { PrismaService } from '../src/prisma.service'; // Ajuste o caminho conforme necessário
import { NivelDeAcesso } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const mockPrismaService = {
  usuario: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    delete: jest.fn(),
    update: jest.fn(),
  },
};

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('deve criar um usuário', async () => {
      const userData = {
        nome: 'Maria Silva',
        email: 'maria.silva@example.com',
        senha: 'senhaSegura',
        nivel_de_acesso: NivelDeAcesso.admin,
      };

      // Mock do hash e do retorno do Prisma
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword');
      mockPrismaService.usuario.create.mockResolvedValue(userData);

      const result = await service.createUser(userData);

      expect(bcrypt.hash).toHaveBeenCalledWith('senhaSegura', 10);
      expect(mockPrismaService.usuario.create).toHaveBeenCalledWith({
        data: {
          nome: userData.nome,
          email: userData.email,
          senha: 'hashedPassword',
          nivel_de_acesso: userData.nivel_de_acesso,
        },
      });
      expect(result).toEqual(userData);
    });
  });

  describe('getAllUsers', () => {
    it('deve retornar todos os usuários', async () => {
      const mockUsers = [
        {
          id: 1,
          nome: 'Maria Silva',
          email: 'maria.silva@example.com',
          nivel_de_acesso: NivelDeAcesso.admin,
        },
      ];

      mockPrismaService.usuario.findMany.mockResolvedValue(mockUsers);

      const result = await service.getAllUsers();

      expect(mockPrismaService.usuario.findMany).toHaveBeenCalled();
      expect(result).toEqual(mockUsers);
    });
  });

  describe('getUserById', () => {
    it('deve retornar um usuário existente', async () => {
      const mockUser = {
        id: 1,
        nome: 'Maria Silva',
        email: 'maria.silva@example.com',
        nivel_de_acesso: NivelDeAcesso.admin,
      };

      mockPrismaService.usuario.findUnique.mockResolvedValue(mockUser);

      const result = await service.getUserById('1');

      expect(mockPrismaService.usuario.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: {
          produtos: true,
          categorias: true,
        },
      });
      expect(result).toEqual(mockUser);
    });

    it('deve lançar um erro se o usuário não for encontrado', async () => {
      mockPrismaService.usuario.findUnique.mockResolvedValue(null);

      await expect(service.getUserById('1')).rejects.toThrow('Usuário não encontrado');
    });
  });

  describe('deleteUser', () => {
    it('deve deletar um usuário existente', async () => {
      const mockUser = {
        id: 1,
        nome: 'Maria Silva',
        email: 'maria.silva@example.com',
        nivel_de_acesso: NivelDeAcesso.admin,
      };

      mockPrismaService.usuario.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.usuario.delete.mockResolvedValue(mockUser);

      const result = await service.deleteUser('1');

      expect(mockPrismaService.usuario.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(mockUser);
    });

    it('deve lançar um erro se o usuário não for encontrado ao deletar', async () => {
      mockPrismaService.usuario.findUnique.mockResolvedValue(null);

      await expect(service.deleteUser('1')).rejects.toThrow('Usuário não encontrado');
    });
  });

  describe('updateUser', () => {
    it('deve atualizar um usuário existente', async () => {
      const mockUser = {
        id: 1,
        nome: 'Maria Silva',
        email: 'maria.silva@example.com',
        nivel_de_acesso: NivelDeAcesso.admin,
      };

      const updateData = { nome: 'Maria Souza' };

      mockPrismaService.usuario.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.usuario.update.mockResolvedValue({ ...mockUser, ...updateData });

      const result = await service.updateUser('1', updateData);

      expect(mockPrismaService.usuario.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { nome: 'Maria Souza' },
      });
      expect(result).toEqual({ ...mockUser, ...updateData });
    });

    it('deve lançar um erro se o usuário não for encontrado ao atualizar', async () => {
      mockPrismaService.usuario.findUnique.mockResolvedValue(null);

      await expect(service.updateUser('1', {})).rejects.toThrow('Usuário não encontrado');
    });
  });
});
