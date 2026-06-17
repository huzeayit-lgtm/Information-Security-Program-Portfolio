type MCPRequest = { action: string; payload?: any };
type MCPResponse = { ok: boolean; result?: unknown; error?: string };
interface MCPModule { name: string; handle(req: MCPRequest): Promise<MCPResponse> }

const GITHUB_API = 'https://api.github.com';

async function ghFetch(path: string, method = 'GET', token?: string, body?: unknown) {
  if (!token) throw new Error('GITHUB_TOKEN not set');
  const res = await fetch(`${GITHUB_API}${path}`, {
    method,
    headers: {
      Authorization: `token ${token}`,
      Accept: 'application/vnd.github+json',
      'User-Agent': 'mcp-github-module'
    },
    body: body ? JSON.stringify(body) : undefined
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`${res.status} ${res.statusText} - ${txt}`);
  }
  return res.json();
}

export const githubModule: MCPModule = {
  name: 'github',
  async handle(req: MCPRequest): Promise<MCPResponse> {
    const token = (globalThis as any).process?.env?.GITHUB_TOKEN;
    try {
      switch (req.action) {
        case 'whoami': {
          const data = await ghFetch('/user', 'GET', token);
          return { ok: true, result: data };
        }
        case 'list-repos': {
          const data = await ghFetch('/user/repos', 'GET', token);
          return { ok: true, result: data };
        }
        case 'create-issue': {
          const { owner, repo, title, body } = req.payload || {};
          if (!owner || !repo || !title) return { ok: false, error: 'owner, repo and title are required' };
          const data = await ghFetch(`/repos/${owner}/${repo}/issues`, 'POST', token, { title, body });
          return { ok: true, result: data };
        }
        default:
          return { ok: false, error: `unknown action ${req.action}` };
      }
    } catch (err: any) {
      return { ok: false, error: err?.message ?? String(err) };
    }
  }
};
