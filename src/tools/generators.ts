import { randomUUID, randomBytes } from "node:crypto";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { nanoid } from "nanoid";

export function registerGeneratorTools(server: McpServer): void {
  // UUID v4 generator
  server.tool(
    "generate_uuid",
    "Generate a cryptographically secure UUID v4.",
    {
      count: z
        .number()
        .int()
        .min(1)
        .max(100)
        .default(1)
        .describe("Number of UUIDs to generate (1-100, default: 1)"),
    },
    async ({ count }) => {
      const uuids = Array.from({ length: count }, () => randomUUID());
      return {
        content: [{ type: "text" as const, text: uuids.join("\n") }],
      };
    }
  );

  // NanoID generator
  server.tool(
    "generate_nanoid",
    "Generate a NanoID — a compact, URL-friendly unique ID.",
    {
      length: z
        .number()
        .int()
        .min(1)
        .max(128)
        .default(21)
        .describe("Length of the NanoID (1-128, default: 21)"),
      count: z
        .number()
        .int()
        .min(1)
        .max(100)
        .default(1)
        .describe("Number of IDs to generate (1-100, default: 1)"),
    },
    async ({ length, count }) => {
      const ids = Array.from({ length: count }, () => nanoid(length));
      return {
        content: [{ type: "text" as const, text: ids.join("\n") }],
      };
    }
  );

  // Random password generator
  server.tool(
    "generate_password",
    "Generate a secure random password with configurable options.",
    {
      length: z
        .number()
        .int()
        .min(4)
        .max(256)
        .default(16)
        .describe("Password length (4-256, default: 16)"),
      uppercase: z
        .boolean()
        .default(true)
        .describe("Include uppercase letters (default: true)"),
      lowercase: z
        .boolean()
        .default(true)
        .describe("Include lowercase letters (default: true)"),
      numbers: z
        .boolean()
        .default(true)
        .describe("Include numbers (default: true)"),
      symbols: z
        .boolean()
        .default(true)
        .describe("Include symbols (default: true)"),
      count: z
        .number()
        .int()
        .min(1)
        .max(50)
        .default(1)
        .describe("Number of passwords to generate (1-50)"),
    },
    async ({ length, uppercase, lowercase, numbers, symbols, count }) => {
      let charset = "";
      if (uppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      if (lowercase) charset += "abcdefghijklmnopqrstuvwxyz";
      if (numbers) charset += "0123456789";
      if (symbols) charset += "!@#$%^&*()_+-=[]{}|;:,.<>?";

      if (charset.length === 0) {
        return {
          content: [
            {
              type: "text" as const,
              text: "Error: At least one character type must be enabled",
            },
          ],
          isError: true,
        };
      }

      const passwords = Array.from({ length: count }, () => {
        const bytes = randomBytes(length);
        return Array.from(bytes)
          .map((b) => charset[b % charset.length])
          .join("");
      });

      return {
        content: [{ type: "text" as const, text: passwords.join("\n") }],
      };
    }
  );

  // Random hex string
  server.tool(
    "generate_random_hex",
    "Generate a random hexadecimal string of the specified byte length.",
    {
      bytes: z
        .number()
        .int()
        .min(1)
        .max(256)
        .default(16)
        .describe("Number of random bytes (output will be 2x this length in hex)"),
    },
    async ({ bytes }) => ({
      content: [
        { type: "text" as const, text: randomBytes(bytes).toString("hex") },
      ],
    })
  );
}
