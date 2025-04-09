import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
@Injectable()
export class ProductService {
  constructor(
    // Inyectamos nuestro repositorio para poder realizar consultas a la base de datos
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      //creamos un producto en base al dto que definimos
      const product = this.productRepository.create(createProductDto);

      // Lo guardamos en la base de datos
      await this.productRepository.save(product);

      return product;
    } catch (error) {
      console.log(error);
    }
  }

  findAll() {
    return this.productRepository.find();
  }

  async findOneById(id: string) {
    //definimos una varibale producto
    let product: Product | null;

    //buscamos por id
    product = await this.productRepository.findOneBy({ id });

    //en caso de que no se encuentre devolvemos un excepcion y cortamos la ejecucion del programa
    if (!product) {
      throw new NotFoundException(`Product with ${id} not found`);
    }

    return product;
  }
  async update(id: string, updateProductDto: UpdateProductDto) {
    //usamos preload para precargar los datos del producto buscando en base a ese id
    const product = await this.productRepository.preload({
      id: id,
      ...updateProductDto,
    });

    // añadimos validaciones
    if (!product) {
      throw new BadRequestException(
        `product Whit id ${id} not found in database`,
      );
    }
    try {
      // guardamos el producto modificado
      await this.productRepository.save(product);
      return product;
    } catch (error) {
      console.log(error);
    }
  }

  async findOneBy(term: string) {
    let product: Product[];

    const queryBuilder = this.productRepository.createQueryBuilder('Product');
    // Buscamos todos los productos que coincidan con la categoria o tipoPrenda especifica a traves de un constructor de cosultas
    product = await queryBuilder
      .where(
        `UPPER(Product.tipoPrenda) =:tipoPrenda or LOWER(Product.categoria) =:categoria`,
        {
          tipoPrenda: term.toUpperCase(),
          categoria: term.toLowerCase(),
        },
      )
      .getMany();

    if (!product) {
      throw new BadRequestException(`Product with ${term} not found`);
    }

    return product;
  }

  async deleteById(id: string) {
    const product = await this.findOneById(id);
    await this.productRepository.remove(product);
  }

  async deleteAll() {
    const query = this.productRepository.createQueryBuilder('product');
    try {
      return await query.delete().where({}).execute();
    } catch (error) {
      console.log(error);
    }
  }
}
