import { Test, TestingModule } from '@nestjs/testing';
import { ShelfController } from '../src/shelf/shelf.controller'; 
import { ShelfService } from '../src/shelf/shelf.service'; 

const mockShelfService = {
  createShelf: jest.fn(),
  getAllShelves: jest.fn(),
  getShelfById: jest.fn(),
  updateShelf: jest.fn(),
  deleteShelf: jest.fn(),
};

describe('ShelfController', () => {
  let controller: ShelfController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShelfController],
      providers: [
        { provide: ShelfService, useValue: mockShelfService },
      ],
    }).compile();

    controller = module.get<ShelfController>(ShelfController);
  });

  it('deve estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('deve criar uma prateleira', async () => {
      const createShelfDto = { nome: 'Prateleira Teste' };

      mockShelfService.createShelf.mockResolvedValue(createShelfDto);

      const result = await controller.create(createShelfDto);

      expect(mockShelfService.createShelf).toHaveBeenCalledWith(createShelfDto);
      expect(result).toEqual(createShelfDto);
    });
  });

  describe('getAll', () => {
    it('deve retornar todas as prateleiras', async () => {
      const mockShelves = [
        { id: 1, nome: 'Prateleira A' },
        { id: 2, nome: 'Prateleira B' },
      ];

      mockShelfService.getAllShelves.mockResolvedValue(mockShelves);

      const result = await controller.getAll();

      expect(mockShelfService.getAllShelves).toHaveBeenCalled();
      expect(result).toEqual(mockShelves);
    });
  });

  describe('getById', () => {
    it('deve retornar uma prateleira existente', async () => {
      const mockShelf = { id: 1, nome: 'Prateleira A' };

      mockShelfService.getShelfById.mockResolvedValue(mockShelf);

      const result = await controller.getById('1');

      expect(mockShelfService.getShelfById).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockShelf);
    });

    it('deve lançar um erro se a prateleira não for encontrada', async () => {
      mockShelfService.getShelfById.mockRejectedValue(new Error('Prateleira não encontrada.'));

      await expect(controller.getById('1')).rejects.toThrow('Prateleira não encontrada.');
    });
  });

  describe('update', () => {
    it('deve atualizar uma prateleira existente', async () => {
      const updateShelfDto = { nome: 'Prateleira Atualizada' };
      const updatedShelf = { id: 1, ...updateShelfDto };

      mockShelfService.updateShelf.mockResolvedValue(updatedShelf);

      const result = await controller.update('1', updateShelfDto);

      expect(mockShelfService.updateShelf).toHaveBeenCalledWith('1', updateShelfDto);
      expect(result).toEqual(updatedShelf);
    });

    it('deve lançar um erro se a prateleira não for encontrada ao atualizar', async () => {
      mockShelfService.updateShelf.mockRejectedValue(new Error('Prateleira não encontrada.'));

      await expect(controller.update('1', { nome: 'Novo Nome' })).rejects.toThrow('Prateleira não encontrada.');
    });
  });

  describe('delete', () => {
    it('deve deletar uma prateleira existente', async () => {
      const mockShelf = { id: 1, nome: 'Prateleira A' };

      mockShelfService.deleteShelf.mockResolvedValue(mockShelf);

      const result = await controller.delete('1');

      expect(mockShelfService.deleteShelf).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockShelf);
    });

    it('deve lançar um erro se a prateleira não for encontrada ao deletar', async () => {
      mockShelfService.deleteShelf.mockRejectedValue(new Error('Não é possível excluir a prateleira, pois ela está sendo referenciada por outro registro.'));

      await expect(controller.delete('1')).rejects.toThrow('Não é possível excluir a prateleira, pois ela está sendo referenciada por outro registro.');
    });
  });
});
