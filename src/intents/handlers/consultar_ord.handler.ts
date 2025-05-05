import { Injectable } from '@nestjs/common';
import { OrderService } from 'src/order/order.service';

@Injectable()
export class ConsultarOrdHandler {
  constructor(
    private readonly orderService:OrderService
  ){}

  async handle( message: string)   {
    
    if (message.length > 3) {
      return `Perfecto, Compartime tu *numero de orden:*`;
    }

    const order = await this.orderService.findOneById(Number(message))
    const EstadoOrden = 
    `*• Número de orden:* ${order.id}\n` +
    `*• Nombre Cliente:* ${order.clientName}\n` +
    `*• Cantidad:* ${order.quantity}\n` +
    `*• Número Telefónico:* ${order.phoneNumber}\n` +
    `*• Estado:* ${order.status}\n` +
    `*• Cantidad a Pagar:* $${order.total}`;
    return `Gracias por compartir tu numero de orden , el detalle de la misma es : \n ${EstadoOrden}`;
  }
}
