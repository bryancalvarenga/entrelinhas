import { OnboardingService } from './onboarding.service';
import { OnboardingDto } from './dto/onboarding.dto';
export declare class OnboardingController {
    private onboardingService;
    constructor(onboardingService: OnboardingService);
    complete(req: any, dto: OnboardingDto): Promise<{
        done: boolean;
    }>;
}
