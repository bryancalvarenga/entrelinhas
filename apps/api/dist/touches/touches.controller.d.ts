import { TouchesService } from './touches.service';
export declare class TouchesController {
    private touchesService;
    constructor(touchesService: TouchesService);
    getStatus(postId: string, req: any): Promise<{
        touched: boolean;
    }>;
    touch(postId: string, req: any): Promise<{
        touched: boolean;
    }>;
    untouch(postId: string, req: any): Promise<{
        touched: boolean;
    }>;
}
