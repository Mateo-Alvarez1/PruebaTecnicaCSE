import { Injectable } from "@nestjs/common";
import { ProductService } from "src/product/product.service";
@Injectable()
export class ConsultarProdHandler {

  constructor(
    private readonly productService:ProductService
  ){}

 async handle(message:string) : Promise<string>{

    // vamos a leer de la base de datos en prod
    const productos = await this.productService.findAll()
    console.log(productos);
    

    if (!productos.length) {
      return 'No hay productos disponibles por el momento.';
    }

    const lista = productos
    .filter(p => p.disponible === "Sí")
    .map(p => `• *${p.tipoPrenda}* *(${p.categoria})* \n • *ID:* *${p.id}* \n  - PRECIO_50_U: *$${p.precio50U}* \n  - PRECIO_100_U: *$${p.precio100U}* \n  - PRECIO_200_U: *$${p.precio200U}* \n  X unidad (pedido mínimo 50) \n `)
    .join('\n');
  
  const mensaje = `📦 Estos son los productos disponibles:\n\n${lista}`;
  return mensaje  
}

}
