import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RepliesService } from './replies.service';
import { CreateReplyDto } from './dto/create-reply.dto';

@Controller('posts/:postId/replies')
export class RepliesController {
  constructor(private repliesService: RepliesService) {}

  @Get()
  findAll(@Param('postId') postId: string) {
    return this.repliesService.findByPost(postId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Param('postId') postId: string,
    @Request() req: any,
    @Body() dto: CreateReplyDto,
  ) {
    return this.repliesService.create(postId, req.user.profileId, dto);
  }

  @Delete(':replyId')
  @UseGuards(JwtAuthGuard)
  remove(
    @Param('replyId') replyId: string,
    @Request() req: any,
  ) {
    return this.repliesService.delete(replyId, req.user.profileId);
  }
}
