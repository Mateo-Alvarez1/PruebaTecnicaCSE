
import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Request } from 'express';
import { catchError, lastValueFrom, map } from 'rxjs';
import { GeminiAiService } from 'src/geminiAi/geminiAi.service';
import { IntentDispatcherService } from 'src/intents/intentDispatcher.service';

@Injectable()
export class WhatsappService {
  constructor(
    private readonly httpService: HttpService,
    private readonly geminiAiService: GeminiAiService,
    private readonly intentService:IntentDispatcherService
  ) {}

  private readonly logger = new Logger(WhatsappService.name);

  testConnection(request: Request) {

    const mode = request.query['hub.mode'];
    const challenge = request.query['hub.challenge'];
    const token = request.query['hub.verify_token'];

    const verificationToken =
      process.env.WHATSAPP_CLOUD_API_WEBHOOK_VERIFICATION_TOKEN;

    if (!mode || !token) {
      return 'Error verify token';
    }

    if (mode === 'subscribe' && token === verificationToken) {
      return challenge?.toString();
    }
  }

  async handleIncomingMessages(request: any) {
    const messages = request?.entry?.[0]?.changes?.[0]?.value?.messages || [];

    if (!messages || !Array.isArray(messages)) {
      this.logger.warn('No se recibieron mensajes válidos');
      return;
    }

    const message = messages[0];
    const messageSender = message?.from;
    const text = message?.text.body;

    const intent = await this.geminiAiService.detectIntent(text);

    const responseText = await this.intentService.dispatch(intent, text , messageSender);

    
    const url = `https://graph.facebook.com/${process.env.WHATSAPP_CLOUD_API_VERSION}/${process.env.WHATSAPP_CLOUD_PHONE_NUMBER_ID}/messages`;

    const config = {
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_CLOUD_API_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',   
      },
    };  

    let messageFormated: any;
    
    if (messageSender?.charAt(2) === '9') {
      messageFormated = messageSender.slice(0, 2) + messageSender.slice(3);
    }

    const data = {
      messaging_product: 'whatsapp',
      to: messageFormated ,
      type: 'text',
      text: {
        preview_url: false,
        body: responseText,
      },
    };
    try {
      let response = this.httpService.post(url, data, config).pipe(
        map((res) => {
          this.logger.debug('Mensaje enviado correctamente:', res.data);
          return res.data;
        }),
        catchError((error) => {
          this.logger.error(
            'Error en la petición a WhatsApp API:',
            error.response?.data || error.message,
          );
          throw new BadRequestException('Error posting to WhatsApp Cloud API');
        }),
      );
      const messagingSendindStatus = await lastValueFrom(response);
      this.logger.log('Message sent.Status', messagingSendindStatus);
    } catch (error) {
      this.logger.error(error);
      return 'Error';
    }
  }
}
