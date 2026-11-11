import { z } from "zod";

export default {
  name: "flashcards",
  title: "Flashcards",
  version: "1.0.0",
  kind: "interactive",
  graded: false,
  description: "Flip cards for commands, terms and rules of thumb. Learners can mark the ones they know. Not graded.",
  schema: z
    .object({
      id: z.string().optional().describe("Stable id."),
      title: z.string().optional().describe("Heading."),
      cards: z
        .array(z.object({ front: z.string().describe("Question / term."), back: z.string().describe("Answer / explanation.") }).strict())
        .min(1)
        .describe("Cards."),
    })
    .strict(),
  example: `title: Slash commands
cards:
  - front: "\`/init\`"
    back: Creates a starter AGENTS.md for the current project.
  - front: "\`/review\`"
    back: Reviews changes (uncommitted, a commit or against a base branch) without editing files.
`,
};
