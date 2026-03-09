import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export function registerConverterTools(server: McpServer): void {
  // Unix timestamp to date
  server.tool(
    "timestamp_to_date",
    "Convert a Unix timestamp (seconds or milliseconds) to a human-readable ISO 8601 date string.",
    {
      timestamp: z.number().describe("Unix timestamp (seconds or milliseconds)"),
      timezone: z
        .string()
        .default("UTC")
        .describe("IANA timezone (e.g., 'America/New_York', 'Europe/London', default: UTC)"),
    },
    async ({ timestamp, timezone }) => {
      try {
        // Auto-detect seconds vs milliseconds
        const ms = timestamp > 1e12 ? timestamp : timestamp * 1000;
        const date = new Date(ms);

        if (isNaN(date.getTime())) {
          return {
            content: [
              { type: "text" as const, text: "Error: Invalid timestamp" },
            ],
            isError: true,
          };
        }

        const result = {
          iso: date.toISOString(),
          utc: date.toUTCString(),
          local: date.toLocaleString("en-US", { timeZone: timezone }),
          timezone,
          unix_seconds: Math.floor(ms / 1000),
          unix_milliseconds: ms,
        };

        return {
          content: [
            { type: "text" as const, text: JSON.stringify(result, null, 2) },
          ],
        };
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

  // Date to Unix timestamp
  server.tool(
    "date_to_timestamp",
    "Convert a date string to a Unix timestamp. Accepts ISO 8601 and common date formats.",
    {
      date: z
        .string()
        .describe(
          "Date string (e.g., '2024-01-15T10:30:00Z', '2024-01-15', 'January 15, 2024')"
        ),
    },
    async ({ date }) => {
      const parsed = new Date(date);
      if (isNaN(parsed.getTime())) {
        return {
          content: [
            {
              type: "text" as const,
              text: "Error: Could not parse date string. Try ISO 8601 format: 'YYYY-MM-DDTHH:mm:ssZ'.",
            },
          ],
          isError: true,
        };
      }

      const result = {
        unix_seconds: Math.floor(parsed.getTime() / 1000),
        unix_milliseconds: parsed.getTime(),
        iso: parsed.toISOString(),
      };

      return {
        content: [
          { type: "text" as const, text: JSON.stringify(result, null, 2) },
        ],
      };
    }
  );

  // Number base converter
  server.tool(
    "number_base_convert",
    "Convert a number between different bases (binary, octal, decimal, hexadecimal, or any base 2-36).",
    {
      value: z.string().describe("The number string to convert"),
      from_base: z
        .number()
        .int()
        .min(2)
        .max(36)
        .default(10)
        .describe("Source base (2-36, default: 10)"),
      to_base: z
        .number()
        .int()
        .min(2)
        .max(36)
        .default(16)
        .describe("Target base (2-36, default: 16)"),
    },
    async ({ value, from_base, to_base }) => {
      try {
        const decimal = parseInt(value, from_base);
        if (isNaN(decimal)) {
          return {
            content: [
              {
                type: "text" as const,
                text: `Error: '${value}' is not a valid base-${from_base} number`,
              },
            ],
            isError: true,
          };
        }

        const result = {
          input: value,
          from_base,
          to_base,
          result: decimal.toString(to_base).toUpperCase(),
          decimal: decimal,
          binary: decimal.toString(2),
          octal: decimal.toString(8),
          hex: decimal.toString(16).toUpperCase(),
        };

        return {
          content: [
            { type: "text" as const, text: JSON.stringify(result, null, 2) },
          ],
        };
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

  // Color converter
  server.tool(
    "color_convert",
    "Convert colors between HEX, RGB, and HSL formats.",
    {
      color: z
        .string()
        .describe(
          "Color value (e.g., '#FF5733', 'rgb(255,87,51)', 'hsl(11,100%,60%)')"
        ),
    },
    async ({ color }) => {
      try {
        let r: number, g: number, b: number;

        const hexMatch = color.match(
          /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i
        );
        const rgbMatch = color.match(
          /rgb\s*\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)/i
        );
        const hslMatch = color.match(
          /hsl\s*\(\s*(\d{1,3})\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*\)/i
        );

        if (hexMatch) {
          r = parseInt(hexMatch[1], 16);
          g = parseInt(hexMatch[2], 16);
          b = parseInt(hexMatch[3], 16);
        } else if (rgbMatch) {
          r = parseInt(rgbMatch[1]);
          g = parseInt(rgbMatch[2]);
          b = parseInt(rgbMatch[3]);
        } else if (hslMatch) {
          const h = parseInt(hslMatch[1]) / 360;
          const s = parseInt(hslMatch[2]) / 100;
          const l = parseInt(hslMatch[3]) / 100;

          if (s === 0) {
            r = g = b = Math.round(l * 255);
          } else {
            const hue2rgb = (p: number, q: number, t: number) => {
              if (t < 0) t += 1;
              if (t > 1) t -= 1;
              if (t < 1 / 6) return p + (q - p) * 6 * t;
              if (t < 1 / 2) return q;
              if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
              return p;
            };
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = Math.round(hue2rgb(p, q, h + 1 / 3) * 255);
            g = Math.round(hue2rgb(p, q, h) * 255);
            b = Math.round(hue2rgb(p, q, h - 1 / 3) * 255);
          }
        } else {
          return {
            content: [
              {
                type: "text" as const,
                text: "Error: Unrecognized color format. Use HEX (#FF5733), RGB (rgb(255,87,51)), or HSL (hsl(11,100%,60%)).",
              },
            ],
            isError: true,
          };
        }

        // RGB to HSL
        const rn = r / 255, gn = g / 255, bn = b / 255;
        const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
        const l = (max + min) / 2;
        let h = 0, s = 0;

        if (max !== min) {
          const d = max - min;
          s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
          switch (max) {
            case rn: h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6; break;
            case gn: h = ((bn - rn) / d + 2) / 6; break;
            case bn: h = ((rn - gn) / d + 4) / 6; break;
          }
        }

        const result = {
          hex: `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`.toUpperCase(),
          rgb: `rgb(${r}, ${g}, ${b})`,
          hsl: `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`,
          r, g, b,
          h: Math.round(h * 360),
          s: Math.round(s * 100),
          l: Math.round(l * 100),
        };

        return {
          content: [
            { type: "text" as const, text: JSON.stringify(result, null, 2) },
          ],
        };
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

  // Byte/Unit converter
  server.tool(
    "byte_convert",
    "Convert between byte units (B, KB, MB, GB, TB, PB). Supports both binary (1024) and SI (1000) standards.",
    {
      value: z.number().describe("The numeric value to convert"),
      from_unit: z
        .enum(["B", "KB", "MB", "GB", "TB", "PB"])
        .describe("Source unit"),
      binary: z
        .boolean()
        .default(true)
        .describe("Use binary (1024) instead of SI (1000) standard (default: true)"),
    },
    async ({ value, from_unit, binary }) => {
      const base = binary ? 1024 : 1000;
      const units = ["B", "KB", "MB", "GB", "TB", "PB"];
      const fromIndex = units.indexOf(from_unit);
      const bytes = value * Math.pow(base, fromIndex);

      const result: Record<string, string> = {
        standard: binary ? "Binary (1024)" : "SI (1000)",
      };

      for (let i = 0; i < units.length; i++) {
        const converted = bytes / Math.pow(base, i);
        result[units[i]] =
          converted >= 1
            ? converted.toLocaleString("en-US", { maximumFractionDigits: 4 })
            : converted.toExponential(4);
      }

      return {
        content: [
          { type: "text" as const, text: JSON.stringify(result, null, 2) },
        ],
      };
    }
  );
}
