import { MCPClient, MCPModule } from '../index';

function mkModule(name: string): MCPModule {
  return {
    name,
    async handle(req) {
      return { ok: true, result: { handled: name, action: req.action } };
    }
  } as MCPModule;
}

async function main() {
  const client = new MCPClient();
  const modules = ['github', 'database', 'filesystem', 'jira', 'slack'];
  for (const m of modules) client.register(mkModule(m));

  for (const m of modules) {
    const res = await client.send(m, { action: 'ping' });
    // eslint-disable-next-line no-console
    console.log(m, '->', res);
  }
}

main().catch((err) => console.error(err));
