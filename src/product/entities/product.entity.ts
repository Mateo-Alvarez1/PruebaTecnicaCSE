import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Product {
  @PrimaryColumn()
  id: string; // id del archivo db.xlsx

  @Column()
  tipoPrenda: string;

  @Column()
  talla: string;

  @Column()
  color: string;

  @Column('int')
  cantidadDisponible: number;

  @Column('decimal', { precision: 10, scale: 2 })
  precio50U: number;

  @Column('decimal', { precision: 10, scale: 2 })
  precio100U: number;

  @Column('decimal', { precision: 10, scale: 2 })
  precio200U: number;

  @Column()
  disponible: string;

  @Column()
  categoria: string;

  @Column({ type: 'text' })
  descripcion: string;
}
