import { Interest, OnboardingIntention } from '@prisma/client';
export declare class OnboardingDto {
    name: string;
    username: string;
    bio?: string;
    interests: Interest[];
    intentions: OnboardingIntention[];
}
