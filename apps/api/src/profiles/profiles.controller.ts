import {
  Controller,
  Get,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ProfilesService } from './profiles.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

// ATENÇÃO: rotas estáticas ("me", "me/posts") devem vir ANTES das paramétricas (":username")
// para que o NestJS não capture "me" como valor de :username.

@Controller('profiles')
export class ProfilesController {
  constructor(private profilesService: ProfilesService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMe(@Request() req: any) {
    return this.profilesService.findMe(req.user.profileId);
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  updateMe(@Request() req: any, @Body() dto: UpdateProfileDto) {
    return this.profilesService.update(req.user.profileId, dto);
  }

  @Get('me/posts')
  @UseGuards(JwtAuthGuard)
  getMyPosts(@Request() req: any) {
    return this.profilesService.getMyPosts(req.user.profileId);
  }

  // Rota estática antes das paramétricas :username
  @Get('search')
  search(@Query('q') q: string) {
    if (!q?.trim()) return [];
    return this.profilesService.search(q.trim());
  }

  // Rotas públicas — sem contagem de seguidores
  @Get(':username/posts')
  getPostsByUsername(@Param('username') username: string) {
    return this.profilesService.getPostsByUsername(username);
  }

  @Get(':username')
  findByUsername(@Param('username') username: string) {
    return this.profilesService.findByUsername(username);
  }
}
