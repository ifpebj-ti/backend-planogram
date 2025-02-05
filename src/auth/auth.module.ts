import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt'; 
import { AuthService } from './auth.service';  
import { JwtAuthGuard } from './jwt-auth.guard';  
import { PrismaModule } from '../prisma.module';

@Module({
  imports: [ PrismaModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'seu_segredo_aqui',  
      signOptions: { expiresIn: '1h' },  
    }),
  ],
  providers: [AuthService, JwtAuthGuard],
  exports: [JwtAuthGuard, AuthService, JwtModule], 
})
export class AuthModule {}
