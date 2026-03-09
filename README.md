# 🛠️ DevUtils MCP Server

> **A comprehensive developer utilities toolkit for the Docker MCP Catalog.**
> 36 everyday tools — hashing, encoding, UUID generation, JWT decoding, JSON formatting, network tools, text utilities, and more.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Docker](https://img.shields.io/badge/Docker-MCP_Toolkit-blue)](https://hub.docker.com/mcp)
[![MCP](https://img.shields.io/badge/MCP-compatible-green)](https://modelcontextprotocol.io)

---

## 🎯 Why?

The Docker MCP Catalog has 200+ servers for databases, APIs, monitoring, and productivity — but **no basic developer utilities** toolkit.

Every developer needs to hash strings, encode/decode data, generate UUIDs, decode JWTs, format JSON, calculate CIDR ranges, and convert timestamps **every day**. DevUtils MCP Server brings all of these tools directly into your AI assistant.

Think of it as **`busybox` for developer tools** — small, essential, and always useful.

---

## 📦 Quick Start

### With Docker

```bash
# Build the image
docker build -t devutils-mcp-server .

# Run (interactive, for MCP clients)
docker run -i --rm devutils-mcp-server
```

### With Claude Desktop

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "devutils": {
      "command": "docker",
      "args": ["run", "-i", "--rm", "devutils-mcp-server"]
    }
  }
}
```

### With Docker MCP Toolkit (Docker Desktop)

If this server is available in the [Docker MCP Catalog](https://hub.docker.com/mcp), you can enable it directly from Docker Desktop:

1. Open **Docker Desktop** → **MCP Toolkit**
2. Search for **DevUtils**
3. Click **Enable**
4. It will be available to any connected MCP client (Claude, Cursor, VS Code, etc.)

### Local Development (without Docker)

```bash
npm install
npm run dev
```

---

## 🔧 Available Tools (36 total)

### 🔐 Hash Tools (6)
| Tool | Description |
|------|-------------|
| `hash_md5` | Generate MD5 hash |
| `hash_sha1` | Generate SHA-1 hash |
| `hash_sha256` | Generate SHA-256 hash |
| `hash_sha512` | Generate SHA-512 hash |
| `hash_bcrypt` | Generate bcrypt hash (configurable rounds) |
| `hash_bcrypt_verify` | Verify string against bcrypt hash |

### 🔄 Encoding Tools (8)
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

### 🎲 Generator Tools (4)
| Tool | Description |
|------|-------------|
| `generate_uuid` | Cryptographic UUID v4 (batch support) |
| `generate_nanoid` | Compact URL-friendly ID (configurable length) |
| `generate_password` | Secure password (configurable complexity) |
| `generate_random_hex` | Random hex string (configurable length) |

### 🔑 JWT Tools (2)
| Tool | Description |
|------|-------------|
| `jwt_decode` | Decode JWT header & payload (with human-readable dates) |
| `jwt_validate` | Validate JWT structure & expiration |

### 📝 Formatter Tools (3)
| Tool | Description |
|------|-------------|
| `json_format` | Pretty-print or minify JSON |
| `json_validate` | Validate JSON with error location |
| `json_path_query` | Extract values using dot-notation path |

### 🔢 Converter Tools (5)
| Tool | Description |
|------|-------------|
| `timestamp_to_date` | Unix timestamp → human date (timezone support) |
| `date_to_timestamp` | Date string → Unix timestamp |
| `number_base_convert` | Convert between bases (bin/oct/dec/hex/any) |
| `color_convert` | Convert colors (HEX ↔ RGB ↔ HSL) |
| `byte_convert` | Convert byte units (B/KB/MB/GB/TB/PB) |

### 🌐 Network Tools (2)
| Tool | Description |
|------|-------------|
| `cidr_calculate` | CIDR → network, broadcast, mask, host range, host count |
| `ip_validate` | Validate & classify IPv4/IPv6 address |

### ✏️ Text Tools (6)
| Tool | Description |
|------|-------------|
| `text_stats` | Character/word/line/sentence count, reading time |
| `lorem_ipsum` | Generate placeholder text |
| `case_convert` | Convert between camelCase, snake_case, PascalCase, etc. |
| `slugify` | Convert string to URL-friendly slug |
| `regex_test` | Test regex pattern against input |
| `text_diff` | Line-by-line diff between two texts |

---

## 🏗️ Architecture

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

**Tech Stack:**
- TypeScript + Node.js 22
- `@modelcontextprotocol/sdk` — Official MCP SDK
- `bcryptjs` — Password hashing
- `nanoid` — Compact ID generation
- `zod` — Input validation

**Zero external API dependencies.** All tools run locally with no network calls.

---

## 🐳 Docker

The image uses a multi-stage build for minimal size:

1. **Build stage**: Compiles TypeScript on Node 22 Alpine
2. **Runtime stage**: Runs compiled JS on Node 22 Alpine as non-root user

```bash
# Build
docker build -t devutils-mcp-server .

# Test
echo '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1.0.0"}}}' | docker run -i --rm devutils-mcp-server
```

---

## 📝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feat/amazing-tool`)
3. Commit your changes (`git commit -m 'feat: add amazing tool'`)
4. Push to the branch (`git push origin feat/amazing-tool`)
5. Open a Pull Request

---

## 📄 License

MIT © [Fernando Paladini](https://github.com/paladini)
