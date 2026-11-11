import { z } from "zod";

const item = z.union([
  z.string(),
  z.object({ text: z.string().describe("What to do."), hint: z.string().optional().describe("Small help text.") }).strict(),
]);

export default {
  name: "checklist",
  title: "Checklist",
  version: "1.0.0",
  kind: "interactive",
  graded: false,
  description: "A personal to-do list for setup steps or readiness checks. Progress is remembered in the learner's browser. Not graded.",
  schema: z
    .object({
      id: z.string().optional().describe("Stable id."),
      title: z.string().optional().describe("Heading."),
      items: z.array(item).min(1).describe("Plain strings, or `{ text, hint }`."),
      done: z.string().optional().describe("Message shown when everything is ticked."),
    })
    .strict(),
  example: `title: Before your first task
items:
  - text: Open a Git repository and create a branch
    hint: Codex works best when you can diff and revert.
  - Sign in with your ChatGPT account
  - Check permissions with \`/status\`
done: You are ready to start.
`,
};
