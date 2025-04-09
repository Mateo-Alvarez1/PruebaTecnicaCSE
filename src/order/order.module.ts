import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { ProductModule } from 'src/product/product.module';
import { WhatsappModule } from 'src/whatsapp/whatsapp.module';

@Module({
  controllers: [OrderController],
  providers: [OrderService],
  imports: [TypeOrmModule.forFeature([Order]), ProductModule, WhatsappModule],
})
export class OrderModule {}
