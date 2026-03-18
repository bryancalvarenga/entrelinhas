import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FollowsService } from './follows.service';

@Controller('profiles/:username')
@UseGuards(JwtAuthGuard)
export class FollowsController {
  constructor(private followsService: FollowsService) {}

  // Retorna apenas { following: boolean } — sem contagem
  @Get('following-status')
  getStatus(@Param('username') username: string, @Request() req: any) {
    return this.followsService.getStatus(username, req.user.profileId);
  }

  @Post('follow')
  @HttpCode(HttpStatus.OK)
  follow(@Param('username') username: string, @Request() req: any) {
    return this.followsService.follow(username, req.user.profileId);
  }

  @Delete('follow')
  @HttpCode(HttpStatus.OK)
  unfollow(@Param('username') username: string, @Request() req: any) {
    return this.followsService.unfollow(username, req.user.profileId);
  }
}
