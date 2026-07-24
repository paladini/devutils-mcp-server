<p align="center">
  <a href="https://paladini.io/harness-score/guide/maturity-model#l0-%C2%B7-unharnessed" title="Harness Score — AI coding harness maturity"><img alt="Harness Score L0 (Unharnessed): measures AI-assisted development harness maturity with harness-score" src="https://paladini.github.io/harness-score/maturity/badge-l0.svg" height="20"></a>
</p>

<p align="center">
  <img src="assets/logo.svg" alt="DevUtils MCP Server logo" width="96">
</p>

# DevUtils MCP Server

**36 everyday developer tools for any MCP-compatible AI assistant.** Hashing, encoding, UUID generation, JWT decoding, JSON formatting, network tools, text utilities, and more — all local, no external APIs.

Think of it as **`busybox` for developer tools** — small, essential, and always useful.

<p align="center">
  <a href="https://opensource.org/licenses/MIT"><img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg"></a>
  <a href="https://modelcontextprotocol.io"><img alt="MCP" src="https://img.shields.io/badge/MCP-compatible-green"></a>
  <a href="https://www.npmjs.com/package/devutils-mcp-server"><img alt="npm" src="https://img.shields.io/npm/v/devutils-mcp-server.svg"></a>
  <a href="https://github.com/paladini/devutils-mcp-server/blob/main/Dockerfile"><img alt="Docker" src="https://img.shields.io/badge/Docker-ready-blue"></a>
  <a href="https://glama.ai/mcp/servers/paladini/devutils-mcp-server"><img alt="Glama" src="https://glama.ai/mcp/servers/paladini/devutils-mcp-server/badges/score.svg"></a>
  <a href="https://smithery.ai/server/devutils-mcp-server"><img alt="Smithery" src="https://smithery.ai/badge/devutils-mcp-server"></a>
  <a href="https://registry.modelcontextprotocol.io"><img alt="MCP Registry" src="https://img.shields.io/badge/MCP_Registry-io.github.paladini%2Fdevutils--mcp--server-blue"></a>
  <a href="https://github.com/paladini/devutils-mcp-server/stargazers"><img alt="GitHub stars" src="https://img.shields.io/github/stars/paladini/devutils-mcp-server?style=social"></a>
</p>

**Also available as a plugin:** [devutils-cursor-plugin](https://github.com/paladini/devutils-cursor-plugin) — one-click install for Cursor and Claude Code.

<p align="center">
  <a href="https://cursor.com/install-mcp?name=devutils&config=eyJjb21tYW5kIjoibnB4IiwiYXJncyI6WyIteSIsImRldnV0aWxzLW1jcC1zZXJ2ZXIiXX0=">
    <img src="https://cursor.com/deeplink/mcp-install-dark.svg" alt="Add DevUtils to Cursor" height="32">
  </a>
  &nbsp;&nbsp;
  <a href="vscode:mcp/install?%7B%22name%22%3A%22devutils%22%2C%22command%22%3A%22npx%22%2C%22args%22%3A%5B%22-y%22%2C%22devutils-mcp-server%22%5D%7D">
    <img src="https://img.shields.io/badge/VS_Code-Install_MCP-007ACC?style=for-the-badge&logo=visualstudiocode" alt="Install DevUtils in VS Code" height="32">
  </a>
</p>

<p align="center">
  <img src="assets/demo.gif" alt="DevUtils MCP Server demo — UUID generation, JWT decode, JSON validation" width="720">
</p>

---

## Why?

Every developer needs to hash strings, encode/decode data, generate UUIDs, decode JWTs, format JSON, calculate CIDR ranges, and convert timestamps **every day**. DevUtils MCP Server brings all of these tools directly into your AI assistant — works with Claude, Cursor, VS Code, Windsurf, and any other MCP-compatible client.

---

## Installation

> **Prerequisite:** [Node.js](https://nodejs.org/) 18+ (Node 22 recommended). Verify with `node -v`.

### One-click / plugin

Use the **Add to Cursor** / **VS Code** badges above, or install the plugin:

```text
/plugin marketplace add paladini/devutils-cursor-plugin
/plugin install devutils-mcp@devutils-cursor-plugin
```

Cursor: **Settings → Customize**, or add from GitHub `paladini/devutils-cursor-plugin`.

### npx (no install)

```bash
npx -y devutils-mcp-server
```

### npm

```bash
npm install -g devutils-mcp-server
devutils-mcp-server
```

### Docker

```bash
# Published image (when available)
docker run -i --rm ghcr.io/paladini/devutils-mcp-server

# Or build locally
docker build -t devutils-mcp-server .
docker run -i --rm devutils-mcp-server

# Or with Compose
docker compose build
docker compose run --rm -i devutils-mcp
```

### Official MCP Registry

Listed as [`io.github.paladini/devutils-mcp-server`](https://registry.modelcontextprotocol.io). Search for `io.github.paladini/devutils`.

### GitHub Packages

Releases are dual-published to npm and GitHub Packages as [`@paladini/devutils-mcp-server`](https://github.com/paladini/devutils-mcp-server/pkgs/npm/devutils-mcp-server) (see [`.github/workflows/release.yml`](.github/workflows/release.yml)). Prefer the public npm package for most installs; use GitHub Packages when you already authenticate against `npm.pkg.github.com`.

```bash
# After authenticating to npm.pkg.github.com for the @paladini scope:
npx -y @paladini/devutils-mcp-server
```

### Smithery

Also available on [Smithery](https://smithery.ai/server/devutils-mcp-server).

---

## Client setup

### Cursor

**One-click:** use the **Add to Cursor** badge at the top of this README.

**Plugin (recommended):** Install [DevUtils MCP](https://github.com/paladini/devutils-cursor-plugin) from **Cursor Settings → Customize**.

**Manual:** Add to `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "devutils": {
      "command": "npx",
      "args": ["-y", "devutils-mcp-server"]
    }
  }
}
```

### Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) or `%APPDATA%\Claude\claude_desktop_config.json` (Windows):

```json
{
  "mcpServers": {
    "devutils": {
      "command": "npx",
      "args": ["-y", "devutils-mcp-server"]
    }
  }
}
```

Or with Docker:

```json
{
  "mcpServers": {
    "devutils": {
      "command": "docker",
      "args": ["run", "-i", "--rm", "ghcr.io/paladini/devutils-mcp-server"]
    }
  }
}
```

### Claude Code

```text
/plugin marketplace add paladini/devutils-cursor-plugin
/plugin install devutils-mcp@devutils-cursor-plugin
```

### VS Code (GitHub Copilot)

**One-click:** use the VS Code badge at the top, or add to `.vscode/mcp.json` / user settings:

```json
{
  "servers": {
    "devutils": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "devutils-mcp-server"]
    }
  }
}
```

### Windsurf

Add to `~/.codeium/windsurf/mcp_config.json`:

```json
{
  "mcpServers": {
    "devutils": {
      "command": "npx",
      "args": ["-y", "devutils-mcp-server"]
    }
  }
}
```

### Docker MCP Toolkit (Docker Desktop)

If this server is available in the [Docker MCP Catalog](https://hub.docker.com/mcp):

1. Open **Docker Desktop → MCP Toolkit**
2. Search for **DevUtils**
3. Click **Enable**

### Local development

```bash
npm install
npm run dev
```

---

## Available tools (36)

### Hash (6)

| Tool | Description |
|------|-------------|
| `hash_md5` | Generate MD5 hash |
| `hash_sha1` | Generate SHA-1 hash |
| `hash_sha256` | Generate SHA-256 hash |
| `hash_sha512` | Generate SHA-512 hash |
| `hash_bcrypt` | Generate bcrypt hash (configurable rounds) |
| `hash_bcrypt_verify` | Verify string against bcrypt hash |

### Encoding (8)

| Tool | Description |
|------|-------------|
| `base64_encode` | Encode string to Base64 |
| `base64_decode` | Decode Base64 to string |
| `url_encode` | URL-encode (percent-encoding) |
| `url_decode` | Decode URL-encoded string |
| `html_encode` | Encode HTML entities |
| `html_decode` | Decode HTML entities |
| `hex_encode` | Encode string to hex |
| `hex_decode` | Decode hex to string |

### Generators (4)

| Tool | Description |
|------|-------------|
| `generate_uuid` | Cryptographic UUID v4 (batch support) |
| `generate_nanoid` | Compact URL-friendly ID (configurable length) |
| `generate_password` | Secure password (configurable complexity) |
| `generate_random_hex` | Random hex string (configurable length) |

### JWT (2)

| Tool | Description |
|------|-------------|
| `jwt_decode` | Decode JWT header & payload (with human-readable dates) |
| `jwt_validate` | Validate JWT structure & expiration |

### Formatters (3)

| Tool | Description |
|------|-------------|
| `json_format` | Pretty-print or minify JSON |
| `json_validate` | Validate JSON with error location |
| `json_path_query` | Extract values using dot-notation path |

### Converters (5)

| Tool | Description |
|------|-------------|
| `timestamp_to_date` | Unix timestamp → human date (timezone support) |
| `date_to_timestamp` | Date string → Unix timestamp |
| `number_base_convert` | Convert between bases (bin/oct/dec/hex/any) |
| `color_convert` | Convert colors (HEX ↔ RGB ↔ HSL) |
| `byte_convert` | Convert byte units (B/KB/MB/GB/TB/PB) |

### Network (2)

| Tool | Description |
|------|-------------|
| `cidr_calculate` | CIDR → network, broadcast, mask, host range, host count |
| `ip_validate` | Validate & classify IPv4/IPv6 address |

### Text (6)

| Tool | Description |
|------|-------------|
| `text_stats` | Character/word/line/sentence count, reading time |
| `lorem_ipsum` | Generate placeholder text |
| `case_convert` | Convert between camelCase, snake_case, PascalCase, etc. |
| `slugify` | Convert string to URL-friendly slug |
| `regex_test` | Test regex pattern against input |
| `text_diff` | Line-by-line diff between two texts |

---

## Architecture

```
src/
├── index.ts          # MCP server entry point (stdio transport)
└── tools/
    ├── hash.ts       # Cryptographic hash functions
    ├── encoding.ts   # Encode/decode utilities
    ├── generators.ts # ID and password generators
    ├── jwt.ts        # JWT decode and validation
    ├── formatters.ts # JSON formatting and querying
    ├── converters.ts # Data type and unit converters
    ├── network.ts    # Network calculation utilities
    └── text.ts       # Text analysis and manipulation
```

**Tech stack:** TypeScript + Node.js 22 · [`@modelcontextprotocol/sdk`](https://github.com/modelcontextprotocol/typescript-sdk) · `bcryptjs` · `nanoid` · `zod`

**Zero external API dependencies.** All tools run locally with no network calls.

---

## Docker

The image uses a multi-stage build for minimal size:

1. **Build stage:** Compiles TypeScript on Node 22 Alpine
2. **Runtime stage:** Runs compiled JS on Node 22 Alpine as a non-root user

```bash
docker build -t devutils-mcp-server .

# Smoke-test with an MCP initialize request
echo '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1.0.0"}}}' | docker run -i --rm devutils-mcp-server
```

---

## FAQ & design philosophy

### Why MCP, and not just a library?

**Valid criticism:** If you're writing Python scripts and need to hash something, `hashlib` is 2 lines of code. Why run MCP overhead?

**Answer:** This server is optimized for **AI agents** in multi-step workflows, not programmers writing code:

1. **AI hallucination cost >> MCP overhead** — An AI model spending 50ms calling an MCP tool (vs. 1ms library call) is negligible when the alternative is the model *making up a hash* or using the wrong encoding.
2. **Reliable tool semantics** — MCP enforces strict tool contracts. For example, `jwt_decode` *always* returns human-readable dates with timezone support.
3. **Universally accessible** — Any MCP-compatible client can use these tools. A Python library only works if your agent is Python-based.
4. **Multi-tenant safety** — MCP provides explicit tool whitelisting with input validation.

### When to use DevUtils versus alternatives

**Use DevUtils if:**
- You're using Claude, Cursor, VS Code Copilot, Windsurf, or any MCP-compatible AI assistant
- You want reliable, validated utility operations in AI workflows
- You need 36 tools in one package

**Don't use DevUtils if:**
- You're writing regular application code (use native libraries)
- You need extreme performance (direct library calls are faster)
- Your AI client does not support MCP

### Design philosophy

- **Small & focused:** 36 utilities, zero external APIs, ~50MB container
- **Security-first:** Non-root user, Alpine Linux, minimal attack surface
- **AI-friendly:** Consistent naming (`<domain>_<operation>`), strict schemas, human-readable outputs
- **Client-agnostic:** Works with any MCP-compatible client via stdio transport

---

## Available on

| Channel | Link |
| --- | --- |
| **Official MCP Registry** | `io.github.paladini/devutils-mcp-server` — [registry.modelcontextprotocol.io](https://registry.modelcontextprotocol.io) |
| **npm** | [devutils-mcp-server](https://www.npmjs.com/package/devutils-mcp-server) |
| **GitHub Packages** | [`@paladini/devutils-mcp-server`](https://github.com/paladini/devutils-mcp-server/pkgs/npm/devutils-mcp-server) (dual-publish on release tags) |
| **GHCR (Docker)** | `ghcr.io/paladini/devutils-mcp-server` |
| **Glama** | [glama.ai/mcp/servers/paladini/devutils-mcp-server](https://glama.ai/mcp/servers/paladini/devutils-mcp-server) |
| **Smithery** | [smithery.ai/server/devutils-mcp-server](https://smithery.ai/server/devutils-mcp-server) |
| **Cursor / Claude plugin** | [devutils-cursor-plugin](https://github.com/paladini/devutils-cursor-plugin) |

---

## Contributing

Questions and ideas: [GitHub Discussions](https://github.com/paladini/devutils-mcp-server/discussions)

Security reports: see [SECURITY.md](SECURITY.md).

1. Fork the repository
2. Create your feature branch (`git checkout -b feat/amazing-tool`)
3. Commit your changes (`git commit -m 'feat: add amazing tool'`)
4. Push to the branch (`git push origin feat/amazing-tool`)
5. Open a Pull Request

See [CHANGELOG.md](CHANGELOG.md).

---

## License

MIT © [Fernando Paladini](https://github.com/paladini)
