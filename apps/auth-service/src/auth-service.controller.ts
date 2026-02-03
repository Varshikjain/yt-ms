import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthServiceService } from './auth-service.service';
import { loginDto, RegisterDto } from '@app/common';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class AuthServiceController {
  constructor(private readonly authServiceService: AuthServiceService) {}

  @Post('register')
   register(@Body() dto: typeof RegisterDto){
    return this.authServiceService.register(dto.email, dto.password, dto.name);
 }

  @Post('login')
   login(@Body() dto: typeof loginDto){
    return this.authServiceService.login(dto.email, dto.password);
 }

 @UseGuards(AuthGuard('jwt'))
 @Get('profile')
  getProfile(@Request() req: {user: {userId: string}}){
    return this.authServiceService.getProfile(req.user.userId);
 }
}
