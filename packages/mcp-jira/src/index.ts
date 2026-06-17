type MCPRequest = { action: string; payload?: unknown };
type MCPResponse = { ok: boolean; result?: unknown; error?: string };
interface MCPModule { name: string; handle(req: MCPRequest): Promise<MCPResponse> }

export const jiraModule: MCPModule = {
  name: 'jira',
  async handle(req: MCPRequest): Promise<MCPResponse> {
    return { ok: true, result: { handled: 'jira', action: req.action } };
  }
};
