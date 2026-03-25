#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerHashTools } from "./tools/hash.js";
import { registerEncodingTools } from "./tools/encoding.js";
import { registerGeneratorTools } from "./tools/generators.js";
import { registerJwtTools } from "./tools/jwt.js";
import { registerFormatterTools } from "./tools/formatters.js";
import { registerConverterTools } from "./tools/converters.js";
import { registerNetworkTools } from "./tools/network.js";
import { registerTextTools } from "./tools/text.js";

const server = new McpServer({
  name: "devutils-mcp-server",
  version: "1.1.0",
  description:
    "A comprehensive suite of everyday developer utility tools. " +
    "Hash generators, encoding/decoding, UUID/password generators, " +
    "JWT decoder, JSON formatter, timestamp converters, network tools, and more.",
});

// Register all tool categories
registerHashTools(server);
registerEncodingTools(server);
registerGeneratorTools(server);
registerJwtTools(server);
registerFormatterTools(server);
registerConverterTools(server);
registerNetworkTools(server);
registerTextTools(server);

// Start the server with stdio transport
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("DevUtils MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
