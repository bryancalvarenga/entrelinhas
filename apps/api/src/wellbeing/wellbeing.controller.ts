import {
  Controller,
  Get,
  Patch,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WellbeingService } from './wellbeing.service';
import { UpdateWellbeingDto } from './dto/update-wellbeing.dto';

@Controller('wellbeing')
@UseGuards(JwtAuthGuard)
export class WellbeingController {
  constructor(private wellbeingService: WellbeingService) {}

  @Get()
  find(@Request() req: any) {
    return this.wellbeingService.find(req.user.userId);
  }

  @Patch()
  update(@Request() req: any, @Body() dto: UpdateWellbeingDto) {
    return this.wellbeingService.update(req.user.userId, dto);
  }
}
