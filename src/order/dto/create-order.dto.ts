import { IsInt, IsString, Min } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  clientName: string;

  @IsString()
  productId: string;

  @IsString()
  phoneNumber: string;

  @IsInt()
  @Min(50)
  quantity: number;
}
