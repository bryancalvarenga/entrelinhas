import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MessagesService } from './messages.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';

@Controller('conversations')
@UseGuards(JwtAuthGuard)
export class MessagesController {
  constructor(private messagesService: MessagesService) {}

  // Encontrar ou criar conversa com outro usuário
  @Post()
  findOrCreate(@Request() req: any, @Body() dto: CreateConversationDto) {
    return this.messagesService.findOrCreate(
      req.user.profileId,
      dto.recipientUsername,
    );
  }

  // Listar todas as conversas do usuário
  @Get()
  findAll(@Request() req: any) {
    return this.messagesService.findAll(req.user.profileId);
  }

  // Abrir conversa com mensagens
  @Get(':id')
  findMessages(@Param('id') id: string, @Request() req: any) {
    return this.messagesService.findMessages(id, req.user.profileId);
  }

  // Status: posso enviar mensagem agora?
  @Get(':id/can-send')
  canSend(@Param('id') id: string, @Request() req: any) {
    return this.messagesService.canSend(id, req.user.profileId);
  }

  // Enviar mensagem
  @Post(':id/messages')
  send(
    @Param('id') id: string,
    @Request() req: any,
    @Body() dto: CreateMessageDto,
  ) {
    return this.messagesService.send(id, req.user.profileId, dto.content);
  }

  // Editar mensagem própria
  @Patch(':id/messages/:messageId')
  edit(
    @Param('id') id: string,
    @Param('messageId') messageId: string,
    @Request() req: any,
    @Body() dto: UpdateMessageDto,
  ) {
    return this.messagesService.edit(id, messageId, req.user.profileId, dto.content);
  }

  // Apagar mensagem própria (soft delete)
  @Delete(':id/messages/:messageId')
  @HttpCode(HttpStatus.OK)
  softDelete(
    @Param('id') id: string,
    @Param('messageId') messageId: string,
    @Request() req: any,
  ) {
    return this.messagesService.softDelete(id, messageId, req.user.profileId);
  }
}
