const fs = (globalThis as any).require ? (globalThis as any).require('fs').promises : (globalThis as any).fs;
const path = (globalThis as any).require ? (globalThis as any).require('path') : (globalThis as any).path;

type MCPRequest = { action: string; payload?: any };
type MCPResponse = { ok: boolean; result?: unknown; error?: string };
interface MCPModule { name: string; handle(req: MCPRequest): Promise<MCPResponse> }

const cwd = (globalThis as any).process?.cwd ? (globalThis as any).process.cwd() : '.';
const DB_PATH = (globalThis as any).process?.env?.MCP_DB_PATH || path.join(cwd, 'data', 'db.json');

async function ensureDb(): Promise<Record<string, any>> {
  try {
    const txt = await fs.readFile(DB_PATH, 'utf8');
    return JSON.parse(txt || '{}');
  } catch (err: any) {
    await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
    await fs.writeFile(DB_PATH, '{}', 'utf8');
    return {};
  }
}

async function writeDb(db: Record<string, any>) {
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), 'utf8');
}

export const databaseModule: MCPModule = {
  name: 'database',
  async handle(req: MCPRequest): Promise<MCPResponse> {
    try {
      const db = await ensureDb();
      switch (req.action) {
        case 'get': {
          const { key } = req.payload || {};
          if (!key) return { ok: false, error: 'key required' };
          return { ok: true, result: db[key] };
        }
        case 'set': {
          const { key, value } = req.payload || {};
          if (!key) return { ok: false, error: 'key required' };
          db[key] = value;
          await writeDb(db);
          return { ok: true, result: true };
        }
        case 'delete': {
          const { key } = req.payload || {};
          if (!key) return { ok: false, error: 'key required' };
          delete db[key];
          await writeDb(db);
          return { ok: true, result: true };
        }
        case 'list': {
          const { prefix } = req.payload || {};
          const keys = Object.keys(db).filter((k) => !prefix || k.startsWith(prefix));
          return { ok: true, result: keys };
        }
        default:
          return { ok: false, error: `unknown action ${req.action}` };
      }
    } catch (err: any) {
      return { ok: false, error: err?.message ?? String(err) };
    }
  }
};
