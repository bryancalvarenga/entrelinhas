import { WellbeingService } from './wellbeing.service';
import { UpdateWellbeingDto } from './dto/update-wellbeing.dto';
export declare class WellbeingController {
    private wellbeingService;
    constructor(wellbeingService: WellbeingService);
    find(req: any): Promise<{
        reducedNotifications: boolean;
        hideInteractions: boolean;
        limitedFeed: boolean;
        silentMode: boolean;
        darkMode: boolean;
    }>;
    update(req: any, dto: UpdateWellbeingDto): Promise<{
        reducedNotifications: boolean;
        hideInteractions: boolean;
        limitedFeed: boolean;
        silentMode: boolean;
        darkMode: boolean;
    }>;
}
