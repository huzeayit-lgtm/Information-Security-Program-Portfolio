export type MCPRequest = {
  action: string;
  payload?: unknown;
};

export type MCPResponse = {
  ok: boolean;
  result?: unknown;
  error?: string;
};

export interface MCPModule {
  name: string;
  handle(request: MCPRequest): Promise<MCPResponse>;
}
