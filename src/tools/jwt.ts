import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export function registerJwtTools(server: McpServer): void {
  // JWT Decode (without verification)
  server.tool(
    "jwt_decode",
    "Decode a JWT (JSON Web Token) and display its header and payload without verifying the signature. Useful for debugging and inspecting tokens.",
    { token: z.string().describe("The JWT string to decode") },
    async ({ token }) => {
      try {
        const parts = token.split(".");
        if (parts.length !== 3) {
          return {
            content: [
              {
                type: "text" as const,
                text: "Error: Invalid JWT format. A JWT must have 3 parts separated by dots (header.payload.signature).",
              },
            ],
            isError: true,
          };
        }

        const decodeBase64Url = (str: string): string => {
          // Replace URL-safe characters and add padding
          const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
          const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
          return Buffer.from(padded, "base64").toString("utf-8");
        };

        const header = JSON.parse(decodeBase64Url(parts[0]));
        const payload = JSON.parse(decodeBase64Url(parts[1]));

        // Enrich payload with human-readable dates
        const enriched = { ...payload };
        if (enriched.iat) enriched.iat_readable = new Date(enriched.iat * 1000).toISOString();
        if (enriched.exp) enriched.exp_readable = new Date(enriched.exp * 1000).toISOString();
        if (enriched.nbf) enriched.nbf_readable = new Date(enriched.nbf * 1000).toISOString();

        const result = {
          header,
          payload: enriched,
          signature: parts[2],
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
              text: `Error decoding JWT: ${e instanceof Error ? e.message : String(e)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // JWT Validate structure
  server.tool(
    "jwt_validate",
    "Validate the structure of a JWT. Checks format, Base64URL encoding, JSON validity, and expiration status. Does NOT verify the cryptographic signature.",
    { token: z.string().describe("The JWT string to validate") },
    async ({ token }) => {
      const issues: string[] = [];
      const checks: Record<string, boolean> = {};

      const parts = token.split(".");
      checks["has_three_parts"] = parts.length === 3;

      if (parts.length !== 3) {
        issues.push(`Expected 3 parts, got ${parts.length}`);
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({ valid: false, checks, issues }, null, 2),
            },
          ],
        };
      }

      const decodeBase64Url = (str: string): string => {
        const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
        const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
        return Buffer.from(padded, "base64").toString("utf-8");
      };

      // Check header
      try {
        const header = JSON.parse(decodeBase64Url(parts[0]));
        checks["valid_header_json"] = true;
        checks["has_alg"] = "alg" in header;
        if (!("alg" in header)) issues.push("Header missing 'alg' field");
      } catch {
        checks["valid_header_json"] = false;
        issues.push("Header is not valid Base64URL-encoded JSON");
      }

      // Check payload
      try {
        const payload = JSON.parse(decodeBase64Url(parts[1]));
        checks["valid_payload_json"] = true;

        // Check expiration
        if (payload.exp) {
          const now = Math.floor(Date.now() / 1000);
          checks["not_expired"] = payload.exp > now;
          if (payload.exp <= now) {
            issues.push(
              `Token expired at ${new Date(payload.exp * 1000).toISOString()}`
            );
          }
        }
      } catch {
        checks["valid_payload_json"] = false;
        issues.push("Payload is not valid Base64URL-encoded JSON");
      }

      // Check signature exists
      checks["has_signature"] = parts[2].length > 0;
      if (parts[2].length === 0) issues.push("Signature is empty");

      const valid = issues.length === 0;

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify({ valid, checks, issues }, null, 2),
          },
        ],
      };
    }
  );
}
