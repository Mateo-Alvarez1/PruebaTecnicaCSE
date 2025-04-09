import { Injectable } from '@nestjs/common';
import { Product } from 'src/product/entities/product.entity';
import { ProductService } from '../product/product.service';
import { initialData } from './data/seed-data';

@Injectable()
export class SeedService {
  // Generamos un seed de produccion para hacer una precarga de datos en la base de datos
  // en este caso Parseamos los datos del archivo DB.xlsx , creamos validaciones a partir del archivo
  // seed-data.ts y realizamos la inyeccion correspondiente
  constructor(private readonly productService: ProductService) {}

  async runSeed() {
    await this.insertProducts();
    return 'seed executed';
  }

  async insertProducts() {
    await this.productService.deleteAll();

    // Llamamos a los productos definidos en InitialData
    const products = initialData.products;

    // Creamos un Arreglo de productos que devuelve una promesa
    const insertPromises: Promise<Product | undefined>[] = [];

    // Iteramos los productos que definimos en nuestro archivo seed-data.ts
    // y vamos pusheando a nuestro arreglo de insertPromises en cada iteracion
    products.forEach((product) => {
      insertPromises.push(this.productService.create(product));
    });

    // Como ultimo paso resolvemos esa promesa para que impacte en la DBs
    await Promise.all(insertPromises);

    return true;
  }
}
