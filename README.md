# MCP Monorepo

Scaffolded pnpm + TypeScript monorepo for MCP client and modules.

Quick start

1. Install pnpm (Corepack can enable it):

	```bash
	corepack enable
	corepack prepare pnpm@latest --activate
	```

2. Bootstrap workspace dependencies:

	```bash
	pnpm install
	```

3. Build all packages:

	```bash
	pnpm -w -r run build
	```

4. Run the demo (after build):

	```bash
	node packages/mcp-client/dist/examples/demo.js
	```

Notes

- If the build fails due to ignored dependency build scripts (esbuild), run `pnpm approve-builds` and retry the build.

GitHub module

The `github` MCP module uses `GITHUB_TOKEN` from the environment. Supported actions:

- `whoami`: returns the authenticated user
- `list-repos`: lists your repositories
- `create-issue`: create an issue in a repo; payload must include `owner`, `repo`, and `title` (optional `body`)

Example (bash):

```bash
export GITHUB_TOKEN=ghp_xxx
# run demo which uses a local stub; or call the client with action create-issue
node packages/mcp-client/dist/examples/demo.js
```

Filesystem module

The `filesystem` MCP module exposes simple file operations. Supported actions:

- `readFile` { filePath, encoding }
- `writeFile` { filePath, content }
- `listDir` { dirPath }
- `delete` { filePath }
- `mkdir` { dirPath }
- `stat` { filePath }
- `writeJSON` { filePath, obj }
- `readJSON` { filePath }

Quick test:

```bash
node scripts/test-filesystem.js
```

