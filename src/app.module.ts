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
    ConfigModule.forRoot(),
    // Inicializamos el modulo raiz de TypeORM para generar la conexion a la base de datos dockerizada
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true, // detecta las entidades automaticamente
      synchronize: true, // sincroniza nuestras entidades con la DB al inciar el programa
    }),
    OrderModule,
    WhatsappModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
