import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthModule } from '../auth/auth.module'; 
import { PrismaService } from '../prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';


@Module({
  imports: [AuthModule],  
  controllers: [UserController],
  providers: [UserService, PrismaService,JwtAuthGuard],
})
export class UserModule {}

