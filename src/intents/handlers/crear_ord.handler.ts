import { Injectable } from '@nestjs/common';
import { OrderService } from 'src/order/order.service';

@Injectable()
export class CrearOrdHandler {
  constructor(
    private readonly orderService:OrderService
  ){}

  async handle( from:string , message: string)   {
    
    const partes = message.split(',');
    if (partes.length < 3) {
      return `Perfecto, vamos a crear una orden. Por favor enviame los siguientes datos separados por coma:
      
Nombre del cliente, ID del producto, Cantidad

✅ Ejemplo: Juan,004,100

*La cantidad debe ser 50, 100 o 200.*`;
    }

    const [name,productId, quantity] = partes;


    const data = {
      clientName:name ,
      productId:productId ,
      phoneNumber: from,
      quantity:Number(quantity)
    }

    const order = await this.orderService.create(data)
    
    return `✅ La orden se creó correctamente. El número de orden es: ${order.id}`;
  }
}
