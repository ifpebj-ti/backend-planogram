import { Module } from '@nestjs/common';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { UserModule } from './user/user.module';
import { ShelfModule } from './shelf/shelf.module';

import { UserController } from './user/user.controller';
import { ProductController } from './product/product.controller';
import { ShelfController } from './shelf/shelf.controller';
import { UserService } from './user/user.service';
import { ProductService } from './product/product.service';
import { CategoryService } from './category/category.service';
import { PrismaService } from './prisma.service';

@Module({
  imports: [CategoryModule, ProductModule, UserModule, ShelfModule], 
  controllers: [UserController, ProductController, ShelfController],  
  providers: [UserService, ProductService, CategoryService, PrismaService],  
})
export class AppModule {}
