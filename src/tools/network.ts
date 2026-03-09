import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export function registerNetworkTools(server: McpServer): void {
  // IPv4 CIDR Calculator
  server.tool(
    "cidr_calculate",
    "Calculate network details from a CIDR notation (e.g., '192.168.1.0/24'). Returns network address, broadcast, host range, and host count.",
    {
      cidr: z
        .string()
        .describe("IPv4 CIDR notation (e.g., '192.168.1.0/24', '10.0.0.0/8')"),
    },
    async ({ cidr }) => {
      try {
        const parts = cidr.split("/");
        if (parts.length !== 2) {
          return {
            content: [
              {
                type: "text" as const,
                text: "Error: Invalid CIDR notation. Expected format: 'x.x.x.x/y'",
              },
            ],
            isError: true,
          };
        }

        const ip = parts[0];
        const prefix = parseInt(parts[1], 10);

        if (prefix < 0 || prefix > 32 || isNaN(prefix)) {
          return {
            content: [
              {
                type: "text" as const,
                text: "Error: Prefix length must be between 0 and 32",
              },
            ],
            isError: true,
          };
        }

        const ipParts = ip.split(".").map(Number);
        if (
          ipParts.length !== 4 ||
          ipParts.some((p) => isNaN(p) || p < 0 || p > 255)
        ) {
          return {
            content: [
              {
                type: "text" as const,
                text: "Error: Invalid IPv4 address",
              },
            ],
            isError: true,
          };
        }

        const ipNum =
          (ipParts[0] << 24) |
          (ipParts[1] << 16) |
          (ipParts[2] << 8) |
          ipParts[3];
        const mask = prefix === 0 ? 0 : (~0 << (32 - prefix)) >>> 0;
        const network = (ipNum & mask) >>> 0;
        const broadcast = (network | ~mask) >>> 0;

        const numToIp = (num: number): string =>
          [(num >>> 24) & 255, (num >>> 16) & 255, (num >>> 8) & 255, num & 255].join(".");

        const numHosts = prefix >= 31 ? (prefix === 32 ? 1 : 2) : Math.pow(2, 32 - prefix) - 2;
        const firstHost = prefix >= 31 ? network : (network + 1) >>> 0;
        const lastHost = prefix >= 31 ? broadcast : (broadcast - 1) >>> 0;

        const result = {
          cidr,
          network_address: numToIp(network),
          broadcast_address: numToIp(broadcast),
          subnet_mask: numToIp(mask),
          wildcard_mask: numToIp((~mask) >>> 0),
          first_host: numToIp(firstHost),
          last_host: numToIp(lastHost),
          total_hosts: numHosts,
          prefix_length: prefix,
          ip_class: ipParts[0] < 128 ? "A" : ipParts[0] < 192 ? "B" : ipParts[0] < 224 ? "C" : ipParts[0] < 240 ? "D" : "E",
          is_private:
            (ipParts[0] === 10) ||
            (ipParts[0] === 172 && ipParts[1] >= 16 && ipParts[1] <= 31) ||
            (ipParts[0] === 192 && ipParts[1] === 168),
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

  // IP Validate
  server.tool(
    "ip_validate",
    "Validate and classify an IPv4 or IPv6 address. Returns type, class, scope, and whether it's private/loopback/multicast.",
    { ip: z.string().describe("IP address to validate") },
    async ({ ip }) => {
      // IPv4 check
      const ipv4Regex =
        /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
      const v4Match = ip.match(ipv4Regex);

      if (v4Match) {
        const parts = [
          parseInt(v4Match[1]),
          parseInt(v4Match[2]),
          parseInt(v4Match[3]),
          parseInt(v4Match[4]),
        ];

        if (parts.some((p) => p > 255)) {
          return {
            content: [
              {
                type: "text" as const,
                text: JSON.stringify(
                  { valid: false, error: "Octet value exceeds 255" },
                  null,
                  2
                ),
              },
            ],
          };
        }

        const result = {
          valid: true,
          version: "IPv4",
          address: ip,
          class:
            parts[0] < 128
              ? "A"
              : parts[0] < 192
                ? "B"
                : parts[0] < 224
                  ? "C"
                  : parts[0] < 240
                    ? "D (Multicast)"
                    : "E (Reserved)",
          is_private:
            parts[0] === 10 ||
            (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) ||
            (parts[0] === 192 && parts[1] === 168),
          is_loopback: parts[0] === 127,
          is_link_local: parts[0] === 169 && parts[1] === 254,
          is_multicast: parts[0] >= 224 && parts[0] <= 239,
          is_broadcast: parts.every((p) => p === 255),
        };

        return {
          content: [
            { type: "text" as const, text: JSON.stringify(result, null, 2) },
          ],
        };
      }

      // IPv6 basic check
      const ipv6Regex = /^([0-9a-f]{0,4}:){2,7}[0-9a-f]{0,4}$/i;
      if (ipv6Regex.test(ip) || ip === "::1" || ip === "::") {
        const result = {
          valid: true,
          version: "IPv6",
          address: ip,
          is_loopback: ip === "::1",
          is_unspecified: ip === "::",
          is_link_local: ip.toLowerCase().startsWith("fe80"),
          is_multicast: ip.toLowerCase().startsWith("ff"),
        };

        return {
          content: [
            { type: "text" as const, text: JSON.stringify(result, null, 2) },
          ],
        };
      }

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              { valid: false, error: "Not a valid IPv4 or IPv6 address" },
              null,
              2
            ),
          },
        ],
      };
    }
  );
}
