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
import { SavedPostsService } from './saved-posts.service';

@Controller()
@UseGuards(JwtAuthGuard)
export class SavedPostsController {
  constructor(private savedPostsService: SavedPostsService) {}

  @Get('saved')
  findAll(@Request() req: any) {
    return this.savedPostsService.findAll(req.user.profileId);
  }

  @Get('posts/:postId/save')
  getSaveStatus(@Param('postId') postId: string, @Request() req: any) {
    return this.savedPostsService.getStatus(postId, req.user.profileId);
  }

  @Post('posts/:postId/save')
  @HttpCode(HttpStatus.OK)
  save(@Param('postId') postId: string, @Request() req: any) {
    return this.savedPostsService.save(postId, req.user.profileId);
  }

  @Delete('posts/:postId/save')
  @HttpCode(HttpStatus.OK)
  unsave(@Param('postId') postId: string, @Request() req: any) {
    return this.savedPostsService.unsave(postId, req.user.profileId);
  }
}
