// __tests__/shelf.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { ShelfService } from '../src/shelf/shelf.service'; // Ajuste o caminho conforme necessário
import { PrismaService } from '../src/prisma.service'; // Ajuste o caminho conforme necessário

const mockPrismaService = {
  prateleira: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('ShelfService', () => {
  let service: ShelfService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShelfService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<ShelfService>(ShelfService);
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('createShelf', () => {
    it('deve criar uma prateleira', async () => {
      const shelfData = { nome: 'Prateleira A' };

      mockPrismaService.prateleira.create.mockResolvedValue(shelfData);

      const result = await service.createShelf(shelfData);

      expect(mockPrismaService.prateleira.create).toHaveBeenCalledWith({
        data: { nome: shelfData.nome },
      });
      expect(result).toEqual(shelfData);
    });
  });

  describe('getAllShelves', () => {
    it('deve retornar todas as prateleiras', async () => {
      const mockShelves = [
        { id: 1, nome: 'Prateleira A' },
        { id: 2, nome: 'Prateleira B' },
      ];

      mockPrismaService.prateleira.findMany.mockResolvedValue(mockShelves);

      const result = await service.getAllShelves();

      expect(mockPrismaService.prateleira.findMany).toHaveBeenCalled();
      expect(result).toEqual(mockShelves);
    });
  });

  describe('getShelfById', () => {
    it('deve retornar uma prateleira existente', async () => {
      const mockShelf = { id: 1, nome: 'Prateleira A' };

      mockPrismaService.prateleira.findUnique.mockResolvedValue(mockShelf);

      const result = await service.getShelfById('1');

      expect(mockPrismaService.prateleira.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(mockShelf);
    });

    it('deve lançar um erro se a prateleira não for encontrada', async () => {
      mockPrismaService.prateleira.findUnique.mockResolvedValue(null);

      await expect(service.getShelfById('1')).rejects.toThrow('Prateleira não encontrada');
    });
  });

  describe('updateShelf', () => {
    it('deve atualizar uma prateleira existente', async () => {
      const mockShelf = { id: 1, nome: 'Prateleira A' };
      const updateData = { nome: 'Prateleira Atualizada' };

      mockPrismaService.prateleira.findUnique.mockResolvedValue(mockShelf);
      mockPrismaService.prateleira.update.mockResolvedValue({ ...mockShelf, ...updateData });

      const result = await service.updateShelf('1', updateData);

      expect(mockPrismaService.prateleira.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { nome: 'Prateleira Atualizada' },
      });
      expect(result).toEqual({ ...mockShelf, ...updateData });
    });

    it('deve lançar um erro se a prateleira não for encontrada ao atualizar', async () => {
      mockPrismaService.prateleira.findUnique.mockResolvedValue(null);

      await expect(service.updateShelf('1', { nome: 'Novo Nome' })).rejects.toThrow('Prateleira não encontrada');
    });
  });

  describe('deleteShelf', () => {
    it('deve deletar uma prateleira existente', async () => {
      const mockShelf = { id: 1, nome: 'Prateleira A' };

      mockPrismaService.prateleira.findUnique.mockResolvedValue(mockShelf);
      mockPrismaService.prateleira.delete.mockResolvedValue(mockShelf);

      const result = await service.deleteShelf('1');

      expect(mockPrismaService.prateleira.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(mockShelf);
    });

    it('deve lançar um erro se a prateleira não for encontrada ao deletar', async () => {
      mockPrismaService.prateleira.findUnique.mockResolvedValue(null);

      await expect(service.deleteShelf('1')).rejects.toThrow('Prateleira não encontrada');
    });
  });
});
