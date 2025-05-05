import { GoogleGenAI } from '@google/genai';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class GeminiAiService {
  
  private readonly geminiAI = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

  private readonly logger = new Logger(GeminiAiService.name);

  async generateAIResponse(userInput: string) : Promise<string>  {

    try {
      const result= await this.geminiAI.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: userInput,
      });

      const response = result?.candidates?.[0]?.content?.parts?.[0]?.text?.trim().toLowerCase();
      return response || '';
    } catch (error) {
      this.logger.error('Error generating AI response', error);
      return 'Ocurrió un error al generar la respuesta.';
    }

  
  }

async detectIntent(userMessage: string): Promise<string> {
  const prompt = `
    Tu tarea es identificar la intención de este mensaje del cliente en relación a una tienda online.
    Los posibles intents son:
    - consultar_productos
    - crear_orden
    - informacion_general
    - estado_orden
    - saludar
    - despedirse
    - desconocido

    Mensaje del usuario: "${userMessage}"

    Responde solamente con el nombre del intent (por ejemplo: consultar_productos).
  `;

  const aiResponse = await this.generateAIResponse(prompt); 

    
  const validIntents = [
    'consultar_productos',
    'crear_orden',
    'estado_orden',
    'informacion_general',
    'saludar',
    'despedirse',
    'desconocido'
  ];

  if (validIntents.includes(aiResponse || '')) {
    return aiResponse || '';
  } else {
    return 'desconocido';
  }
}
}