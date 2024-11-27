import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt'; 
import { AuthService } from './auth.service';  
import { JwtAuthGuard } from './jwt-auth.guard';  

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default-secret',  
      signOptions: { expiresIn: '1h' },  
    }),
  ],
  providers: [AuthService, JwtAuthGuard],
  exports: [JwtAuthGuard, AuthService, JwtModule], 
})
export class AuthModule {}
