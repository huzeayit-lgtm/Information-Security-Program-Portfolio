const path = require('path');
// expose require on globalThis so compiled modules can access it if needed
globalThis.require = require;
const { MCPClient } = require(path.join(__dirname, '..', 'packages', 'mcp-client', 'dist', 'index.js'));
const { filesystemModule } = require(path.join(__dirname, '..', 'packages', 'mcp-filesystem', 'dist', 'index.js'));

async function run() {
  const client = new MCPClient();
  client.register(filesystemModule);

  const tmp = path.join(process.cwd(), 'tmp', 'fs-test');
  const file = path.join(tmp, 'hello.txt');
  console.log('Writing file', file);
  await client.send('filesystem', { action: 'writeFile', payload: { filePath: file, content: 'hello world' } });
  const read = await client.send('filesystem', { action: 'readFile', payload: { filePath: file } });
  console.log('Read result:', read);
  const list = await client.send('filesystem', { action: 'listDir', payload: { dirPath: tmp } });
  console.log('List:', list);
  const stat = await client.send('filesystem', { action: 'stat', payload: { filePath: file } });
  console.log('Stat:', stat);
  await client.send('filesystem', { action: 'delete', payload: { filePath: tmp } });
  console.log('Deleted tmp dir');
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
