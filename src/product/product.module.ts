import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { WhatsappModule } from 'src/whatsapp/whatsapp.module';

@Module({
  controllers: [ProductController],
  providers: [ProductService],
  //importamos la entidad para que sea accesible y pueda interactuar con
  // la DB mediante TypeORM
  imports: [TypeOrmModule.forFeature([Product])],
  exports: [ProductService, TypeOrmModule],
})
export class ProductModule {}
