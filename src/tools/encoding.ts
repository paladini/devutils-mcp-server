import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export function registerEncodingTools(server: McpServer): void {
  // Base64 Encode
  server.tool(
    "base64_encode",
    "Encode a string to Base64.",
    { input: z.string().describe("The string to encode") },
    async ({ input }) => ({
      content: [
        {
          type: "text" as const,
          text: Buffer.from(input, "utf-8").toString("base64"),
        },
      ],
    })
  );

  // Base64 Decode
  server.tool(
    "base64_decode",
    "Decode a Base64 string back to plain text.",
    { input: z.string().describe("The Base64 string to decode") },
    async ({ input }) => {
      try {
        const decoded = Buffer.from(input, "base64").toString("utf-8");
        return { content: [{ type: "text" as const, text: decoded }] };
      } catch {
        return {
          content: [
            { type: "text" as const, text: "Error: Invalid Base64 input" },
          ],
          isError: true,
        };
      }
    }
  );

  // URL Encode
  server.tool(
    "url_encode",
    "URL-encode a string (percent-encoding).",
    { input: z.string().describe("The string to URL-encode") },
    async ({ input }) => ({
      content: [{ type: "text" as const, text: encodeURIComponent(input) }],
    })
  );

  // URL Decode
  server.tool(
    "url_decode",
    "Decode a URL-encoded string.",
    { input: z.string().describe("The URL-encoded string to decode") },
    async ({ input }) => {
      try {
        return {
          content: [
            { type: "text" as const, text: decodeURIComponent(input) },
          ],
        };
      } catch {
        return {
          content: [
            {
              type: "text" as const,
              text: "Error: Invalid URL-encoded input",
            },
          ],
          isError: true,
        };
      }
    }
  );

  // HTML Encode
  server.tool(
    "html_encode",
    "Encode special characters in a string to HTML entities.",
    { input: z.string().describe("The string to HTML-encode") },
    async ({ input }) => {
      const encoded = input
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
      return { content: [{ type: "text" as const, text: encoded }] };
    }
  );

  // HTML Decode
  server.tool(
    "html_decode",
    "Decode HTML entities in a string back to their original characters.",
    { input: z.string().describe("The HTML-encoded string to decode") },
    async ({ input }) => {
      const decoded = input
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&#x27;/g, "'")
        .replace(/&#x2F;/g, "/");
      return { content: [{ type: "text" as const, text: decoded }] };
    }
  );

  // Hex Encode
  server.tool(
    "hex_encode",
    "Encode a string to its hexadecimal representation.",
    { input: z.string().describe("The string to hex-encode") },
    async ({ input }) => ({
      content: [
        {
          type: "text" as const,
          text: Buffer.from(input, "utf-8").toString("hex"),
        },
      ],
    })
  );

  // Hex Decode
  server.tool(
    "hex_decode",
    "Decode a hexadecimal string back to plain text.",
    { input: z.string().describe("The hex string to decode") },
    async ({ input }) => {
      try {
        const cleaned = input.replace(/\s/g, "").replace(/^0x/i, "");
        const decoded = Buffer.from(cleaned, "hex").toString("utf-8");
        return { content: [{ type: "text" as const, text: decoded }] };
      } catch {
        return {
          content: [
            { type: "text" as const, text: "Error: Invalid hex input" },
          ],
          isError: true,
        };
      }
    }
  );
}
