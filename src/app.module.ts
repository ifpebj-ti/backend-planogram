// src/app.module.ts
import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UserService } from './user/user.service';
import { UserController } from './user/user.controller';
import { ProductService } from './product/product.service';
import { ProductController } from './product/product.controller';
import { CategoryService } from './category/category.service';
import { CategoryModule } from './category/category.module';
import { ShelfController } from './shelf/shelf.controller';
import { ShelfModule } from './shelf/shelf.module';
import { ProductModule } from './product/product.module';
import { UserModule } from './user/user.module';

@Module({
  
 
imports: [CategoryModule, ProductModule, UserModule, ShelfModule], 
  controllers: [],
providers: [],
})
export class AppModule {}
