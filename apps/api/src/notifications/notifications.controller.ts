import {
  Controller,
  Get,
  Patch,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Get()
  findUnread(@Request() req: any) {
    return this.notificationsService.findUnread(req.user.profileId);
  }

  @Patch('read')
  @HttpCode(HttpStatus.OK)
  markAllRead(@Request() req: any) {
    return this.notificationsService.markAllRead(req.user.profileId);
  }

  @Patch(':id/read')
  @HttpCode(HttpStatus.OK)
  markOneRead(@Param('id') id: string, @Request() req: any) {
    return this.notificationsService.markOneRead(id, req.user.profileId);
  }
}
