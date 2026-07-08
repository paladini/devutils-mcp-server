# Official MCP Registry — publish steps

Everything is configured. Run these commands from this directory after authenticating.

## Prerequisites

1. **npm package must include `mcpName`** — already in `package.json`:
   ```json
   "mcpName": "io.github.paladini/devutils-mcp-server"
   ```

2. **Publish to npm** (required before registry; `mcpName` is not in npm `1.0.0` yet):

   ```bash
   npm login
   npm install
   npm publish
   ```

   This publishes `1.1.0` with `mcpName`. The `server.json` version must match the published npm version.

3. **`mcp-publisher.exe`** is in this directory (or download from [registry releases](https://github.com/modelcontextprotocol/registry/releases)).

## Publish to registry

```powershell
cd devutils-mcp-server

.\mcp-publisher.exe login github
# Open https://github.com/login/device and enter the code shown

.\mcp-publisher.exe validate
.\mcp-publisher.exe publish
```

## Verify

```bash
curl "https://registry.modelcontextprotocol.io/v0/servers?search=io.github.paladini/devutils"
```

## Registry entry

| Field | Value |
| --- | --- |
| Name | `io.github.paladini/devutils-mcp-server` |
| npm | `devutils-mcp-server@1.1.0` |
| Transport | stdio via `npx -y devutils-mcp-server` |

## Claude plugin (separate repo)

Submit `devutils-cursor-plugin` at https://platform.claude.com/plugins/submit

Install in Claude Code:

```text
/plugin marketplace add paladini/devutils-cursor-plugin
/plugin install devutils-mcp@devutils-cursor-plugin
```
