import { Injectable } from '@nestjs/common';
import { Twilio } from 'twilio';
@Injectable()
export class WhatsappService {
  //Creamos un cliente de Twilio
  private client: Twilio;

  constructor() {
    // inicializamos el clientes con las variables de entorno SID y AUTH_TOKEN
    this.client = new Twilio(
      process.env.ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN,
    );
  }

  // Vamos a crear y enviar un mensaje tomando como parametros el numero del cliente y el mensaje que definimos en el order.service.ts
  async sendMessage(to: string, message: string) {
    return await this.client.messages.create({
      body: message,
      from: `whatsapp:${process.env.TWILIO_PHONE}`,
      to: `whatsapp:${to}`,
    });
  }
}
