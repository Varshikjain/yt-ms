import { Injectable, HttpException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { SERVICE_PORTS } from '@app/common';

@Injectable()
export class AuthService {
    private readonly authServiceUrl = `http://localhost:${SERVICE_PORTS['auth-service']}`;

    constructor(private readonly httpService: HttpService) {}
    
    async register(data: { email: string, password: string, name: string }) {
        try {
            const response = await firstValueFrom(
                this.httpService.post(`${this.authServiceUrl}/register`, data),
            );
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    async login(data: { email: string, password: string}) {
        try {
            const response = await firstValueFrom(
                this.httpService.post(`${this.authServiceUrl}/login`, data),
            );
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    async getProfile(token:string) {
        try {
            const response = await firstValueFrom(
                this.httpService.get(`${this.authServiceUrl}/profile`, { 
                    headers: { Authorization: token }
                 }),
            );
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }


    private handleError(error:any):never{
        if(error.response){
            throw new HttpException(error.response.data, error.response.status);
        } else {
            throw new HttpException('An unexpected error occurred', 503);
        }
    }
}
