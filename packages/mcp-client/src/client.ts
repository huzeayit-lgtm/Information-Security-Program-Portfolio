import { MCPModule, MCPRequest, MCPResponse } from './types';

export class MCPClient {
  private modules = new Map<string, MCPModule>();

  register(module: MCPModule) {
    this.modules.set(module.name, module);
  }

  async send(moduleName: string, req: MCPRequest): Promise<MCPResponse> {
    const mod = this.modules.get(moduleName);
    if (!mod) return { ok: false, error: 'Module not found' };
    return mod.handle(req);
  }
}
