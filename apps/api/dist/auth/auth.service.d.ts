import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../database/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private prisma;
    private jwt;
    constructor(prisma: PrismaService, jwt: JwtService);
    register(dto: RegisterDto): Promise<{
        accessToken: string;
        profileId: string;
    }>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
        profileId: string;
    }>;
    deleteAccount(userId: string): Promise<{
        deleted: boolean;
    }>;
    private signToken;
}
