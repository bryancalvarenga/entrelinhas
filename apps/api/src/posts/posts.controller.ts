import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Request() req: any, @Body() dto: CreatePostDto) {
    return this.postsService.create(req.user.profileId, dto);
  }

  // Status de publicação — guarded, retorna { canPost, nextPostAt }
  @Get('can-post')
  @UseGuards(JwtAuthGuard)
  canPost(@Request() req: any) {
    return this.postsService.canPost(req.user.profileId);
  }

  // Rota estática antes da paramétrica :id
  @Get('search')
  search(@Query('q') q: string) {
    if (!q?.trim()) return [];
    return this.postsService.search(q.trim());
  }

  // Registro aleatório público — usado na landing page
  @Get('random')
  findRandom() {
    return this.postsService.findRandom();
  }

  // Endpoint público — não inclui contagem de touches
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findById(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @Request() req: any) {
    return this.postsService.delete(id, req.user.profileId);
  }
}
