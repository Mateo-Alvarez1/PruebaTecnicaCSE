import { Body, Controller, Get, HttpCode, Post, Req } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';
import { Request } from 'express';

@Controller('whatsapp')
export class WhatsappController {

  constructor(private readonly whatsappService: WhatsappService) {}

  @Get('webhook')
  testConnection(@Req() request: Request) {
    return this.whatsappService.testConnection(request);
  }

  @Post('webhook')
  @HttpCode(200)
  async handleIncomingMessages(@Body() request: any) {
    return this.whatsappService.handleIncomingMessages(request)
  }
}
