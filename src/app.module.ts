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
import { ImportarPlanilhaService } from './product/importar-planilha.service';
import { ImportarPlanilhaModule } from './product/importar-planilha.module';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth/auth.service';  
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Module({
  imports: [CategoryModule, ProductModule, UserModule, ShelfModule,ImportarPlanilhaModule], 
  controllers: [UserController, ProductController, ShelfController],  
  providers: [UserService, ProductService, CategoryService, PrismaService, ImportarPlanilhaService, JwtService, AuthService, JwtAuthGuard],  
  exports: [AuthService],
})
export class AppModule {}
