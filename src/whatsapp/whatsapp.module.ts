import { Module } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';
import { WhatsappController } from './whatsapp.controller';
import { HttpModule } from '@nestjs/axios';
import { GeminiAiModule } from 'src/geminiAi/geminiAi.module'; 
import { IntentDispatcherService } from 'src/intents/intentDispatcher.service';
import { ConversationStateService } from 'src/intents/handlers/state/conversation_state';
import { ConsultarProdHandler } from 'src/intents/handlers/consultar_prod.handler';
import { CrearOrdHandler } from 'src/intents/handlers/crear_ord.handler';
import { ProductModule } from 'src/product/product.module';
import { OrderModule } from 'src/order/order.module';
import { ConsultarOrdHandler } from 'src/intents/handlers/consultar_ord.handler';

@Module({
  controllers: [WhatsappController],
  providers: [WhatsappService ,    IntentDispatcherService,
    ConversationStateService,
    ConsultarOrdHandler,
    ConsultarProdHandler,
    CrearOrdHandler,],
  imports: [HttpModule , GeminiAiModule , ProductModule , OrderModule]
})
export class WhatsappModule {}
