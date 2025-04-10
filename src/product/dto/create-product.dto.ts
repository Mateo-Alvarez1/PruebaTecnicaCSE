import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  tipoPrenda: string;

  @IsString()
  @IsNotEmpty()
  talla: string;

  @IsString()
  @IsNotEmpty()
  color: string;

  @IsNumber()
  @Min(0)
  @Transform(({ value }) => Number(value))
  cantidadDisponible: number;

  @IsNumber()
  @Min(0)
  @Transform(({ value }) => Number(value))
  precio50U: number;

  @IsNumber()
  @Min(0)
  @Transform(({ value }) => Number(value))
  precio100U: number;

  @IsNumber()
  @Min(0)
  @Transform(({ value }) => Number(value))
  precio200U: number;

  @IsString()
  disponible: string;

  @IsString()
  @IsNotEmpty()
  categoria: string;

  @IsString()
  descripcion: string;
}
