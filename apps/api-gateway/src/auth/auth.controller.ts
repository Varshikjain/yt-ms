import { Body, Controller, Post, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from '@app/common';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService){}

    @Post('register')
    register(@Body() RegisterDto: RegisterDto) {
        return this.authService.register(RegisterDto);
    }

    @Post('login')
    login(@Body() LoginDto: any) {
        return this.authService.login(LoginDto);
    }

    @Post('profile')
    profile(@Headers('Authorization') authorization: string) {
        return this.authService.getProfile(authorization);
    }

}
