import { Product } from 'src/product/entities/product.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;
  // Este proyecto no implementa lógica de autenticación pero en una versión productiva las órdenes estarían asociadas automáticamente al usuario autenticado utilizando JWT y decoradores personalizados para extraer su identidad.
  @Column()
  clientName: string;
  @CreateDateColumn()
  createdAt: Date;
  @Column({
    default: 50,
  })
  quantity: Number;
  @Column()
  phoneNumber: string;

  @Column({ default: 'pending' })
  status: 'pending' | 'confirmed' | 'cancelled';

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  total: number;

  @ManyToOne(() => Product, (product) => product.orders, { cascade: true })
  products: Product;
}
