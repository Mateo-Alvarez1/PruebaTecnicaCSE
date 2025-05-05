import { Module } from '@nestjs/common';
import { SeedModule } from './seed/seed.module';
import { ProductModule } from './product/product.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderModule } from './order/order.module';
import { WhatsappModule } from './whatsapp/whatsapp.module';
@Module({
  imports: [
    SeedModule,
    ProductModule,
    WhatsappModule,
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true, // detecta las entidades automaticamente
      synchronize: true, // sincroniza nuestras entidades con la DB al inciar el programa
    }),

    OrderModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
