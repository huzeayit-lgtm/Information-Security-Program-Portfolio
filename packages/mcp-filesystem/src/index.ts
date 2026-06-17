// We'll dynamically import `fs` and `path` inside the handler to remain runtime-safe

type MCPRequest = { action: string; payload?: any };
type MCPResponse = { ok: boolean; result?: unknown; error?: string };
interface MCPModule { name: string; handle(req: MCPRequest): Promise<MCPResponse> }

// Dynamic imports are typed as `any` below to avoid requiring Node type defs.

export const filesystemModule: MCPModule = {
  name: 'filesystem',
  async handle(req: MCPRequest): Promise<MCPResponse> {
    try {
      const { action, payload } = req;
      const nodeReq: any = (0, eval)('require');
      const fsModule: any = nodeReq('fs');
      const fs = fsModule.promises;
      const path: any = nodeReq('path');
      switch (action) {
        case 'readFile': {
          const { filePath, encoding } = payload || {};
          if (!filePath) return { ok: false, error: 'filePath required' };
                    const txt = await fs.readFile(filePath, encoding || 'utf8');
          return { ok: true, result: txt };
        }
        case 'writeFile': {
          const { filePath, content } = payload || {};
          if (!filePath) return { ok: false, error: 'filePath required' };
          await fs.mkdir(path.dirname(filePath), { recursive: true });
          await fs.writeFile(filePath, content ?? '', 'utf8');
          return { ok: true, result: true };
        }
        case 'listDir': {
          const { dirPath } = payload || {};
          if (!dirPath) return { ok: false, error: 'dirPath required' };
          const items = await fs.readdir(dirPath);
          return { ok: true, result: items };
        }
        case 'delete': {
          const { filePath } = payload || {};
          if (!filePath) return { ok: false, error: 'filePath required' };
          await fs.rm(filePath, { recursive: true, force: true });
          return { ok: true, result: true };
        }
        case 'mkdir': {
          const { dirPath } = payload || {};
          if (!dirPath) return { ok: false, error: 'dirPath required' };
          await fs.mkdir(dirPath, { recursive: true });
          return { ok: true, result: true };
        }
        case 'stat': {
          const { filePath } = payload || {};
          if (!filePath) return { ok: false, error: 'filePath required' };
          const s = await fs.stat(filePath);
          return { ok: true, result: { isFile: s.isFile(), isDirectory: s.isDirectory(), size: s.size, mtime: s.mtime } };
        }
        case 'writeJSON': {
          const { filePath, obj } = payload || {};
          if (!filePath) return { ok: false, error: 'filePath required' };
          await fs.mkdir(path.dirname(filePath), { recursive: true });
          await fs.writeFile(filePath, JSON.stringify(obj, null, 2), 'utf8');
          return { ok: true, result: true };
        }
        case 'readJSON': {
          const { filePath } = payload || {};
          if (!filePath) return { ok: false, error: 'filePath required' };
          const txt = await fs.readFile(filePath, 'utf8');
          return { ok: true, result: JSON.parse(txt) };
        }
        default:
          return { ok: false, error: `unknown action ${action}` };
      }
    } catch (err: any) {
      return { ok: false, error: err?.message ?? String(err) };
    }
  }
};
