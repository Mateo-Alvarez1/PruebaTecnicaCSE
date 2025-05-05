import { Module } from '@nestjs/common';
import { GeminiAiService } from './geminiAi.service';

@Module({
  controllers: [],
  providers: [GeminiAiService],
  exports: [GeminiAiModule , GeminiAiService]
})
export class GeminiAiModule {}
