import { Strategy } from 'passport-jwt';
import { PrismaService } from '../../database/prisma.service';
export interface JwtPayload {
    sub: string;
    profileId: string;
}
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private prisma;
    constructor(prisma: PrismaService);
    validate(payload: JwtPayload): Promise<{
        userId: string;
        profileId: string;
    }>;
}
export {};
