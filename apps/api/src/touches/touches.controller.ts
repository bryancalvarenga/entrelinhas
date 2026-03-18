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
import { TouchesService } from './touches.service';

// Todos os endpoints são protegidos — touch é sempre privado.
// Nenhum contador é retornado em nenhum endpoint.

@Controller('posts/:postId/touch')
@UseGuards(JwtAuthGuard)
export class TouchesController {
  constructor(private touchesService: TouchesService) {}

  @Get()
  getStatus(@Param('postId') postId: string, @Request() req: any) {
    return this.touchesService.getStatus(postId, req.user.profileId);
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  touch(@Param('postId') postId: string, @Request() req: any) {
    return this.touchesService.touch(postId, req.user.profileId);
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  untouch(@Param('postId') postId: string, @Request() req: any) {
    return this.touchesService.untouch(postId, req.user.profileId);
  }
}
