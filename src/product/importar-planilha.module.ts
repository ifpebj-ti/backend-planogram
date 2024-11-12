import { Module, forwardRef } from '@nestjs/common';
import { ImportarPlanilhaService } from './importar-planilha.service';
import { ProductModule } from './product.module';

@Module({
  imports: [
    forwardRef(() => ProductModule), 
    
  ],
  providers: [ImportarPlanilhaService],
  exports: [ImportarPlanilhaService],
})
export class ImportarPlanilhaModule {}
