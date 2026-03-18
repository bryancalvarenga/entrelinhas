import { StatsService } from './stats.service';
export declare class StatsController {
    private statsService;
    constructor(statsService: StatsService);
    getStats(): Promise<{
        users: number;
        posts: number;
    }>;
}
