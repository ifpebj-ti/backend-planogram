import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import * as XLSX from 'xlsx';
import { ProductService } from './product.service'; // Importação do ProductService

@Injectable()
export class ImportarPlanilhaService {
  constructor(
    @Inject(forwardRef(() => ProductService))  // Garantir que forwardRef() está aqui também
    private readonly productService: ProductService,
  ) {}

  async importarPlanilha(filePath: string): Promise<{ success: boolean; message: string }> {
    try {
      const workbook = XLSX.readFile(filePath); 
      const sheetName = workbook.SheetNames[0]; 
      const sheet = workbook.Sheets[sheetName]; 
      const data = XLSX.utils.sheet_to_json(sheet);
      
      if (!data || data.length === 0) {
        throw new BadRequestException('Formato de planilha incorreto ou vazio.');
      }

      for (const item of data) {
        await this.productService.createProduct({
          nome: item['nome'],
          id_categoria: item['id_categoria'],
          preco: item['preco'],
          fornecedor: item['fornecedor'],
          venda_por_dia: item['venda_por_dia'],
          usuarioId: item['usuarioId'],
        });
      }

      return { success: true, message: 'Importação concluída com sucesso.' };
    } catch (error) {
      throw new BadRequestException('Erro ao importar a planilha: ' + error.message);
    }
  }
}
