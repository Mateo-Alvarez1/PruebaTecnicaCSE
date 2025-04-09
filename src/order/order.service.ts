import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { ProductService } from '../product/product.service';
import { WhatsappService } from '../whatsapp/whatsapp.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly productService: ProductService,
    private readonly whatsappService: WhatsappService,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    const { productId, quantity, ...rest } = createOrderDto;

    // Vamos a buscar el producto que el cliente desea
    const product = await this.productService.findOneById(productId);

    let total = 0;
    // Aplicamos validaciones para calcular el precio en relacion a la cantidad deseada
    if (quantity === 50) total = product.precio50U;
    else if (quantity === 100) total = product.precio100U;
    else if (quantity === 200) total = product.precio200U;
    else
      throw new BadRequestException(
        'Invalid quantity. Must be 50, 100 or 200.',
      );

    //Por ultimo creamos la orden y cambiamos su estado de 'pending a confirmed'
    const order = this.orderRepository.create({
      ...rest,
      total: total,
      createdAt: new Date(),
      products: product,
      status: 'confirmed',
    });

    // Vamos a crear el template del mensaje que se le va a enviar al cliente una vez que realiza el pedido
    const message = `Hola *${order.clientName}*, tu orden fue creada con éxito.
El *Total a pagar* es: *${order.total}*. 
*Detalle:* ${order.products.tipoPrenda} ${order.products.color} ${order.products.talla}. 
${order.products.descripcion}. 
Muchas gracias por tu compra! 
*Estado:* ${order.status}`;
    // Enviamos los datos al metodo sendMessage de nuestro WhatsappService que se va a encargar de manejar el envio de mensajes
    await this.whatsappService.sendMessage(order.phoneNumber, message);
    // por ultimo guardamos la orden en nuestra base de datos y retornamos
    await this.orderRepository.save(order);

    return order;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    // buscamos una orden por el id
    const order = await this.orderRepository.findOne({ where: { id } });

    if (!order) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }

    // una vez que estamos seguros que la orden llegan vamos a :
    //    - Sacar la diferencia en milisegundos entre la fecha de hoy y la fecha de creacion
    //    - Parseamos esa diferencia a minutos para poder hacer la validacion
    const difInMs = Date.now() - new Date(order.createdAt).getTime();
    const difInMinutes = difInMs / (1000 * 60);

    // En caso de que no pase la validacion se lanza una excepcion de que el producto no se puede actualizar pasado los 5 minutos
    if (difInMinutes > 5) {
      throw new BadRequestException(
        'The order can only be edited in the first 5 minutes after its creation.',
      );
    }

    // Actualizamos el producto y lo guardamos en la Db
    const updateProd = await this.orderRepository.preload({
      id,
      ...updateOrderDto,
    });

    if (!updateProd) {
      throw new BadRequestException('Order is undefined');
    }

    return await this.orderRepository.save(updateProd);
  }
}
