import { Module } from '@nestjs/common';
import { TouchesController } from './touches.controller';
import { TouchesService } from './touches.service';

@Module({
  controllers: [TouchesController],
  providers: [TouchesService],
})
export class TouchesModule {}
