import { createHash } from "node:crypto";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import bcrypt from "bcryptjs";

export function registerHashTools(server: McpServer): void {
  // MD5 hash
  server.tool(
    "hash_md5",
    "Generate an MD5 hash of the given input string.",
    { input: z.string().describe("The string to hash") },
    async ({ input }) => ({
      content: [
        {
          type: "text" as const,
          text: createHash("md5").update(input).digest("hex"),
        },
      ],
    })
  );

  // SHA-1 hash
  server.tool(
    "hash_sha1",
    "Generate a SHA-1 hash of the given input string.",
    { input: z.string().describe("The string to hash") },
    async ({ input }) => ({
      content: [
        {
          type: "text" as const,
          text: createHash("sha1").update(input).digest("hex"),
        },
      ],
    })
  );

  // SHA-256 hash
  server.tool(
    "hash_sha256",
    "Generate a SHA-256 hash of the given input string.",
    { input: z.string().describe("The string to hash") },
    async ({ input }) => ({
      content: [
        {
          type: "text" as const,
          text: createHash("sha256").update(input).digest("hex"),
        },
      ],
    })
  );

  // SHA-512 hash
  server.tool(
    "hash_sha512",
    "Generate a SHA-512 hash of the given input string.",
    { input: z.string().describe("The string to hash") },
    async ({ input }) => ({
      content: [
        {
          type: "text" as const,
          text: createHash("sha512").update(input).digest("hex"),
        },
      ],
    })
  );

  // Bcrypt hash
  server.tool(
    "hash_bcrypt",
    "Generate a bcrypt hash of the given input string. Useful for password hashing.",
    {
      input: z.string().describe("The string to hash"),
      rounds: z
        .number()
        .int()
        .min(4)
        .max(16)
        .default(10)
        .describe("Number of salt rounds (4-16, default: 10)"),
    },
    async ({ input, rounds }) => {
      const hash = await bcrypt.hash(input, rounds);
      return {
        content: [{ type: "text" as const, text: hash }],
      };
    }
  );

  // Bcrypt verify
  server.tool(
    "hash_bcrypt_verify",
    "Verify a string against a bcrypt hash. Returns true if matches.",
    {
      input: z.string().describe("The plain text string"),
      hash: z.string().describe("The bcrypt hash to verify against"),
    },
    async ({ input, hash }) => {
      const isMatch = await bcrypt.compare(input, hash);
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify({ match: isMatch }),
          },
        ],
      };
    }
  );
}
