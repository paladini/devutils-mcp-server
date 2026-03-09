import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export function registerFormatterTools(server: McpServer): void {
  // JSON Format (pretty-print)
  server.tool(
    "json_format",
    "Format (pretty-print) a JSON string with configurable indentation. Can also minify JSON.",
    {
      input: z.string().describe("The JSON string to format"),
      indent: z
        .number()
        .int()
        .min(0)
        .max(8)
        .default(2)
        .describe("Number of spaces for indentation (0 = minify, default: 2)"),
    },
    async ({ input, indent }) => {
      try {
        const parsed = JSON.parse(input);
        const formatted =
          indent === 0
            ? JSON.stringify(parsed)
            : JSON.stringify(parsed, null, indent);
        return { content: [{ type: "text" as const, text: formatted }] };
      } catch (e) {
        return {
          content: [
            {
              type: "text" as const,
              text: `Error: Invalid JSON — ${e instanceof Error ? e.message : String(e)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // JSON Validate
  server.tool(
    "json_validate",
    "Validate a JSON string and report any parsing errors with their approximate location.",
    { input: z.string().describe("The JSON string to validate") },
    async ({ input }) => {
      try {
        JSON.parse(input);
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(
                { valid: true, message: "Valid JSON" },
                null,
                2
              ),
            },
          ],
        };
      } catch (e) {
        const message = e instanceof Error ? e.message : String(e);

        // Try to extract position info from error
        const posMatch = message.match(/position\s+(\d+)/i);
        const position = posMatch ? parseInt(posMatch[1], 10) : undefined;

        let context: string | undefined;
        if (position !== undefined) {
          const start = Math.max(0, position - 20);
          const end = Math.min(input.length, position + 20);
          context = input.slice(start, end);
        }

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(
                {
                  valid: false,
                  error: message,
                  position,
                  context,
                },
                null,
                2
              ),
            },
          ],
        };
      }
    }
  );

  // JSON Path Query
  server.tool(
    "json_path_query",
    "Extract a value from a JSON object using a dot-notation path (e.g., 'user.address.city' or 'items[0].name').",
    {
      input: z.string().describe("The JSON string to query"),
      path: z
        .string()
        .describe(
          "Dot-notation path (e.g., 'user.name', 'data[0].id', 'config.db.host')"
        ),
    },
    async ({ input, path }) => {
      try {
        const obj = JSON.parse(input);
        const parts = path.replace(/\[(\d+)\]/g, ".$1").split(".");
        let current: unknown = obj;

        for (const part of parts) {
          if (current === null || current === undefined) {
            return {
              content: [
                {
                  type: "text" as const,
                  text: `Error: Path '${path}' not found — hit null/undefined at '${part}'`,
                },
              ],
              isError: true,
            };
          }
          current = (current as Record<string, unknown>)[part];
        }

        const result =
          typeof current === "object"
            ? JSON.stringify(current, null, 2)
            : String(current);

        return { content: [{ type: "text" as const, text: result }] };
      } catch (e) {
        return {
          content: [
            {
              type: "text" as const,
              text: `Error: ${e instanceof Error ? e.message : String(e)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );
}
