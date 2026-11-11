import { z } from "zod";

export default {
  name: "order",
  title: "Put in order",
  version: "1.0.0",
  kind: "interactive",
  graded: true,
  description:
    "Learners arrange steps into the right sequence (drag or arrow buttons). Write `items` in the **correct** order — they are shuffled for the learner. Worth 1 point; partial credit for items in the right place.",
  schema: z
    .object({
      id: z.string().optional().describe("Stable id."),
      title: z.string().optional().describe("Heading."),
      prompt: z.string().optional().describe("Instruction shown above the list."),
      items: z.array(z.string()).min(3).max(10).describe("Steps in the CORRECT order."),
      explain: z.string().optional().describe("Shown when the order is right."),
      graded: z.boolean().default(true).describe("Set false for practice only."),
    })
    .strict(),
  example: `title: The agent work loop
prompt: Arrange the steps of a healthy Codex task.
items:
  - Describe the goal, context, constraints and done-when
  - Let Codex plan, then approve the plan
  - Codex edits code and runs the checks
  - Review the diff yourself
  - Commit or ask for changes
explain: Plan before code, verify before commit.
`,
};
