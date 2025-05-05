import { Injectable } from '@nestjs/common';
import { ConsultarProdHandler } from './handlers/consultar_prod.handler';
import { CrearOrdHandler } from './handlers/crear_ord.handler';
import { ConversationStateService } from './handlers/state/conversation_state';
import { GeminiAiService } from 'src/geminiAi/geminiAi.service';
import { ConsultarOrdHandler } from './handlers/consultar_ord.handler';


@Injectable()
export class IntentDispatcherService {
  constructor(
    private readonly consultarProdHandler: ConsultarProdHandler,
    private readonly crearOrdHandler: CrearOrdHandler,
    private readonly geminiAiService: GeminiAiService,
    private readonly consultarOrdHandler:ConsultarOrdHandler,
    private readonly conversationService:ConversationStateService
  ) {}

  async dispatch(intent: string ,text:string , from:string): Promise<string> {

    
    console.log(from);
    

    const estado = this.conversationService.getEstado(from);

    if (estado === 'esperando_datos_orden') {
      this.conversationService.limpiarEstado(from); 
      return this.crearOrdHandler.handle(from, text);
    }

    if (estado === 'esperando_info_orden') {
      this.conversationService.limpiarEstado(from); 
      return this.consultarOrdHandler.handle(text);
    }

    switch (intent) {
      case 'consultar_productos':
        return this.consultarProdHandler.handle(text);
      case 'crear_orden':
        this.conversationService.setEstado(from, 'esperando_datos_orden');
        return this.crearOrdHandler.handle(from,text);
      case 'informacion_general':
        const prompt = `Actúa como un asistente virtual de una empresa de venta mayorista de productos. Responde de forma clara, amigable y profesional. 
        Brinda una descripción general de nuestros servicios, incluyendo el catálogo de productos, formas de contacto, proceso de compra y atención al cliente. 
        Nuestro negocio se llama *Mitos*, vendemos ropa urbana, todos productos propios de produccion nacional y tambien hacemos ventas mayoristas.`;
        const response = await this.geminiAiService.generateAIResponse(prompt);
        return response
      case 'estado_orden':
        this.conversationService.setEstado(from, 'esperando_info_orden');
        return this.consultarOrdHandler.handle(text);
      case 'saludar':
        return 'Hola , como estas ? En que puedo ayudarte hoy ?.';
      case 'despedirse':
        return 'Que tengas lindo dia ! cualquier cosa puedes encontrarme aqui';
      default:
        return 'No puedo responder tu consulta en este momento . Prueba ingresando: \n • Lista de Productos \n • Crear Orden  \n • Informacion General  \n • Ver estado de orden ';
    }
  }
}
