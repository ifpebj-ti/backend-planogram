import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { PrismaModule } from '../prisma.module'; // Importe o PrismaModule aqui

@Module({
  imports: [PrismaModule],  // Adicione o PrismaModule nos imports
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
