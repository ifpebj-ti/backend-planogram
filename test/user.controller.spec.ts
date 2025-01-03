import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../src/user/user.controller';
import { UserService } from '../src/user/user.service';
import { NivelDeAcesso } from '@prisma/client';
import { AuthService } from '../src/auth/auth.service';
import { JwtAuthGuard } from '../src/auth/jwt-auth.guard';

jest.mock('../src/auth/jwt-auth.guard', () => ({
  JwtAuthGuard: jest.fn(() => true), 
}));

const mockUserService = {
  createUser: jest.fn(),
  getAllUsers: jest.fn(),
  getUserById: jest.fn(),
  updateUser: jest.fn(),
  deleteUser: jest.fn(),
};

const mockAuthService = {
  login: jest.fn(),
};

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: AuthService, useValue: mockAuthService },
      ],
    })
      .overrideGuard(JwtAuthGuard) 
      .useValue({ canActivate: jest.fn(() => true) }) 
      .compile();

    controller = module.get<UserController>(UserController);
  });

  it('deve estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('createUser', () => {
    it('deve criar um usuário', async () => {
      const createUserDto = { nome: 'Usuário Teste', email: 'teste@example.com', senha: 'senha123', nivel_de_acesso: NivelDeAcesso.common };

      mockUserService.createUser.mockResolvedValue(createUserDto);

      const result = await controller.createUser(createUserDto);

      expect(mockUserService.createUser).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(createUserDto);
    });
  });

  describe('getAllUsers', () => {
    it('deve retornar todos os usuários', async () => {
      const mockUsers = [
        { id: 1, nome: 'Usuário A', email: 'a@example.com' },
        { id: 2, nome: 'Usuário B', email: 'b@example.com' },
      ];

      mockUserService.getAllUsers.mockResolvedValue(mockUsers);

      const result = await controller.getAllUsers();

      expect(mockUserService.getAllUsers).toHaveBeenCalled();
      expect(result).toEqual(mockUsers);
    });
  });

  describe('getUserById', () => {
    it('deve retornar um usuário existente', async () => {
      const mockUser = { id: 1, nome: 'Usuário A', email: 'a@example.com' };

      mockUserService.getUserById.mockResolvedValue(mockUser);

      const result = await controller.getUserById('1');

      expect(mockUserService.getUserById).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockUser);
    });

    it('deve lançar um erro se o usuário não for encontrado', async () => {
      mockUserService.getUserById.mockRejectedValue(new Error('Usuário não encontrado.'));

      await expect(controller.getUserById('1')).rejects.toThrow('Usuário não encontrado.');
    });
  });

  describe('updateUser', () => {
    it('deve atualizar um usuário existente', async () => {
      const updateUserDto = { nome: 'Usuário Atualizado' };
      const updatedUser = { id: 1, ...updateUserDto };

      mockUserService.updateUser.mockResolvedValue(updatedUser);

      const result = await controller.updateUser('1', updateUserDto);

      expect(mockUserService.updateUser).toHaveBeenCalledWith('1', updateUserDto);
      expect(result).toEqual(updatedUser);
    });

    it('deve lançar um erro se o usuário não for encontrado ao atualizar', async () => {
      mockUserService.updateUser.mockRejectedValue(new Error('Usuário não encontrado.'));

      await expect(controller.updateUser('1', { nome: 'Novo Nome' })).rejects.toThrow('Usuário não encontrado.');
    });
  });

  describe('deleteUser', () => {
    it('deve deletar um usuário existente', async () => {
      const mockUser = { id: 1, nome: 'Usuário A', email: 'a@example.com' };

      mockUserService.deleteUser.mockResolvedValue(mockUser);

      const result = await controller.deleteUser('1');

      expect(mockUserService.deleteUser).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockUser);
    });

    it('deve lançar um erro se o usuário não for encontrado ao deletar', async () => {
      mockUserService.deleteUser.mockRejectedValue(new Error('Usuário não encontrado.'));

      await expect(controller.deleteUser('1')).rejects.toThrow('Usuário não encontrado.');
    });
  });
});
