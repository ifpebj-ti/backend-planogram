import { Module, forwardRef } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { PrismaModule } from '../prisma.module';
import { ImportarPlanilhaModule } from './importar-planilha.module';
import { MulterModule } from '@nestjs/platform-express';
import { ImportarPlanilhaService } from './importar-planilha.service';
import { PrismaService } from '../prisma.service';

@Module({
  imports: [
    PrismaModule,
    forwardRef(() => ImportarPlanilhaModule), 
    MulterModule.register({
      dest: './uploads',
    }),
  ],
  controllers: [ProductController],
  providers: [ProductService, ImportarPlanilhaService, PrismaService],
  exports: [ProductService, ImportarPlanilhaService],
})
export class ProductModule {}
