import { Injectable } from "@nestjs/common";

@Injectable()
export class ConversationStateService {
  private estadoUsuarios = new Map<string, string>();

  setEstado(userId: string, estado: string) {
    this.estadoUsuarios.set(userId, estado);
  }

  getEstado(userId: string): string | undefined {
    return this.estadoUsuarios.get(userId);
  }

  limpiarEstado(userId: string) {
    this.estadoUsuarios.delete(userId);
  }
}
