import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export function registerTextTools(server: McpServer): void {
  // Text statistics
  server.tool(
    "text_stats",
    "Analyze text and return detailed statistics: character count, word count, line count, sentence count, paragraph count, and reading time.",
    { input: z.string().describe("The text to analyze") },
    async ({ input }) => {
      const chars = input.length;
      const charsNoSpaces = input.replace(/\s/g, "").length;
      const words = input.trim() === "" ? 0 : input.trim().split(/\s+/).length;
      const lines = input === "" ? 0 : input.split(/\r?\n/).length;
      const sentences = input.trim() === ""
        ? 0
        : input.split(/[.!?]+/).filter((s) => s.trim().length > 0).length;
      const paragraphs = input.trim() === ""
        ? 0
        : input.split(/\n\s*\n/).filter((p) => p.trim().length > 0).length;
      const readingTimeMinutes = Math.ceil(words / 200);

      const result = {
        characters: chars,
        characters_no_spaces: charsNoSpaces,
        words,
        lines,
        sentences,
        paragraphs,
        reading_time_minutes: readingTimeMinutes,
        avg_word_length:
          words > 0
            ? +(charsNoSpaces / words).toFixed(1)
            : 0,
      };

      return {
        content: [
          { type: "text" as const, text: JSON.stringify(result, null, 2) },
        ],
      };
    }
  );

  // Lorem Ipsum generator
  server.tool(
    "lorem_ipsum",
    "Generate Lorem Ipsum placeholder text.",
    {
      type: z
        .enum(["paragraphs", "sentences", "words"])
        .default("paragraphs")
        .describe("Type of output: paragraphs, sentences, or words"),
      count: z
        .number()
        .int()
        .min(1)
        .max(50)
        .default(3)
        .describe("Number of paragraphs/sentences/words to generate"),
    },
    async ({ type, count }) => {
      const loremWords = [
        "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing",
        "elit", "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore",
        "et", "dolore", "magna", "aliqua", "enim", "ad", "minim", "veniam",
        "quis", "nostrud", "exercitation", "ullamco", "laboris", "nisi",
        "aliquip", "ex", "ea", "commodo", "consequat", "duis", "aute", "irure",
        "in", "reprehenderit", "voluptate", "velit", "esse", "cillum",
        "fugiat", "nulla", "pariatur", "excepteur", "sint", "occaecat",
        "cupidatat", "non", "proident", "sunt", "culpa", "qui", "officia",
        "deserunt", "mollit", "anim", "id", "est", "laborum", "at", "vero",
        "eos", "accusamus", "iusto", "odio", "dignissimos", "ducimus",
        "blanditiis", "praesentium", "voluptatum", "deleniti", "atque",
        "corrupti", "quos", "dolores", "quas", "molestias", "excepturi",
        "obcaecati", "cupiditate", "provident", "similique", "explicabo",
        "nemo", "ipsam", "voluptatem", "quia", "voluptas", "aspernatur",
        "aut", "odit", "fugit", "consequuntur", "magni",
      ];

      const randomWord = (i: number): string =>
        loremWords[(i * 7 + 13) % loremWords.length];

      const generateSentence = (idx: number): string => {
        const length = 8 + (idx % 7);
        const words = Array.from({ length }, (_, i) => randomWord(idx * 20 + i));
        words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
        return words.join(" ") + ".";
      };

      const generateParagraph = (idx: number): string => {
        const sentenceCount = 4 + (idx % 4);
        return Array.from({ length: sentenceCount }, (_, i) =>
          generateSentence(idx * 10 + i)
        ).join(" ");
      };

      let text: string;
      if (type === "words") {
        text = Array.from({ length: count }, (_, i) => randomWord(i)).join(" ");
      } else if (type === "sentences") {
        text = Array.from({ length: count }, (_, i) =>
          generateSentence(i)
        ).join(" ");
      } else {
        text = Array.from({ length: count }, (_, i) =>
          generateParagraph(i)
        ).join("\n\n");
      }

      return { content: [{ type: "text" as const, text }] };
    }
  );

  // Case converter
  server.tool(
    "case_convert",
    "Convert a string between different casing styles: camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE, Title Case, and more.",
    {
      input: z.string().describe("The string to convert"),
      to: z
        .enum([
          "camelCase",
          "PascalCase",
          "snake_case",
          "kebab-case",
          "CONSTANT_CASE",
          "Title Case",
          "lowercase",
          "UPPERCASE",
        ])
        .describe("Target case style"),
    },
    async ({ input, to }) => {
      // Tokenize: split on spaces, hyphens, underscores, and camelCase boundaries
      const words = input
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/[_\-]+/g, " ")
        .split(/\s+/)
        .filter((w) => w.length > 0)
        .map((w) => w.toLowerCase());

      let result: string;
      switch (to) {
        case "camelCase":
          result = words
            .map((w, i) =>
              i === 0 ? w : w.charAt(0).toUpperCase() + w.slice(1)
            )
            .join("");
          break;
        case "PascalCase":
          result = words
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join("");
          break;
        case "snake_case":
          result = words.join("_");
          break;
        case "kebab-case":
          result = words.join("-");
          break;
        case "CONSTANT_CASE":
          result = words.join("_").toUpperCase();
          break;
        case "Title Case":
          result = words
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" ");
          break;
        case "lowercase":
          result = words.join(" ");
          break;
        case "UPPERCASE":
          result = words.join(" ").toUpperCase();
          break;
        default:
          result = input;
      }

      return { content: [{ type: "text" as const, text: result }] };
    }
  );

  // Slugify
  server.tool(
    "slugify",
    "Convert a string to a URL-friendly slug. Removes special characters, replaces spaces with hyphens, and lowercases everything.",
    { input: z.string().describe("The string to slugify") },
    async ({ input }) => {
      const slug = input
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
        .replace(/[^a-z0-9\s-]/g, "") // Remove special chars
        .replace(/\s+/g, "-") // Spaces to hyphens
        .replace(/-+/g, "-") // Collapse hyphens
        .replace(/^-+|-+$/g, ""); // Trim hyphens

      return { content: [{ type: "text" as const, text: slug }] };
    }
  );

  // Regex tester
  server.tool(
    "regex_test",
    "Test a regular expression pattern against an input string. Returns all matches with groups and indices.",
    {
      pattern: z.string().describe("The regex pattern (without delimiters)"),
      flags: z
        .string()
        .default("g")
        .describe("Regex flags (default: 'g')"),
      input: z.string().describe("The string to test against"),
    },
    async ({ pattern, flags, input }) => {
      try {
        const regex = new RegExp(pattern, flags);
        const matches: Array<{
          match: string;
          index: number;
          groups: Record<string, string> | null;
        }> = [];

        let m;
        if (flags.includes("g")) {
          while ((m = regex.exec(input)) !== null) {
            matches.push({
              match: m[0],
              index: m.index,
              groups: m.groups ? { ...m.groups } : null,
            });
            if (matches.length > 100) break; // Safety limit
          }
        } else {
          m = regex.exec(input);
          if (m) {
            matches.push({
              match: m[0],
              index: m.index,
              groups: m.groups ? { ...m.groups } : null,
            });
          }
        }

        const result = {
          pattern,
          flags,
          input_length: input.length,
          matches_found: matches.length,
          matches,
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
              text: `Error: Invalid regex — ${e instanceof Error ? e.message : String(e)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // Text diff
  server.tool(
    "text_diff",
    "Compare two strings and show a simple line-by-line diff. Lines prefixed with '+' are additions, '-' are deletions, ' ' are unchanged.",
    {
      text1: z.string().describe("First text (original)"),
      text2: z.string().describe("Second text (modified)"),
    },
    async ({ text1, text2 }) => {
      const lines1 = text1.split("\n");
      const lines2 = text2.split("\n");
      const maxLen = Math.max(lines1.length, lines2.length);
      const diffLines: string[] = [];

      for (let i = 0; i < maxLen; i++) {
        const l1 = i < lines1.length ? lines1[i] : undefined;
        const l2 = i < lines2.length ? lines2[i] : undefined;

        if (l1 === l2) {
          diffLines.push(`  ${l1}`);
        } else {
          if (l1 !== undefined) diffLines.push(`- ${l1}`);
          if (l2 !== undefined) diffLines.push(`+ ${l2}`);
        }
      }

      const summary = {
        lines_in_original: lines1.length,
        lines_in_modified: lines2.length,
        additions: diffLines.filter((l) => l.startsWith("+ ")).length,
        deletions: diffLines.filter((l) => l.startsWith("- ")).length,
        unchanged: diffLines.filter((l) => l.startsWith("  ")).length,
      };

      const output = `${JSON.stringify(summary, null, 2)}\n\n--- Diff ---\n${diffLines.join("\n")}`;

      return { content: [{ type: "text" as const, text: output }] };
    }
  );
}
