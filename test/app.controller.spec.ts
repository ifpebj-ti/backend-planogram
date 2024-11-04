import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from '../src/app.controller'; 
import { AppService } from '../src/app.service'; 

const mockAppService = {
  getHello: jest.fn(() => 'Hello World!'),
};

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        { provide: AppService, useValue: mockAppService },
      ],
    }).compile();

    appController = module.get<AppController>(AppController);
  });

  it('deve estar definido', () => {
    expect(appController).toBeDefined();
  });

  it('deve retornar "Hello World!"', () => {
    expect(appController.getHello()).toBe('Hello World!');
    expect(mockAppService.getHello).toHaveBeenCalled();
  });
});
