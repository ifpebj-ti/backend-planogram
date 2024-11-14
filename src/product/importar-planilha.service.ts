import { Injectable } from '@nestjs/common';
import * as XLSX from 'xlsx';

@Injectable()
export class ImportarPlanilhaService {
  async importarPlanilha(fileBuffer: Buffer): Promise<any> {
    try {
      const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(worksheet);
      return json;
    } catch (error) {
      throw new Error('Erro ao processar o arquivo: ' + error.message);
    }
  }
}
