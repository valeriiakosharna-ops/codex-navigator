import { z } from "zod";

export default {
  name: "quiz",
  title: "Quiz",
  version: "1.1.0",
  kind: "interactive",
  graded: true,
  maxScore: (d) => d.questions.length,
  description:
    "Multiple-choice questions with instant feedback and an explanation. Single answer (`answer: 0`) or several (`answer: [0, 2]`). Counts towards the Moodle grade: one point per question.",
  schema: z
    .object({
      id: z.string().optional().describe("Stable id; keeps saved answers if you reorder blocks."),
      title: z.string().optional().describe("Heading above the questions."),
      shuffle: z.boolean().default(false).describe("Shuffle options (stable per learner)."),
      graded: z.boolean().default(true).describe("Set false for a practice-only quiz."),
      paged: z.boolean().optional().describe("One question at a time. Default: on inside slide pages, off otherwise."),
      questions: z
        .array(
          z.object({
            q: z.string().describe("Question text (Markdown allowed)."),
            options: z.array(z.string()).min(2).describe("Answer options."),
            answer: z.union([z.number().int(), z.array(z.number().int()).min(1)]).describe("Index of the correct option, counting from 0; a list for several."),
            explain: z.string().optional().describe("Shown after checking. Explain *why*."),
          }).superRefine((q, ctx) => {
            for (const a of [].concat(q.answer)) {
              if (a < 0 || a >= q.options.length)
                ctx.addIssue({ code: "custom", path: ["answer"], message: `answer ${a} does not exist — options are numbered 0..${q.options.length - 1}` });
            }
          }),
        )
        .min(1)
        .describe("List of questions."),
    })
    .strict(),
  example: `title: Quick check
questions:
  - q: Which file does Codex read automatically for project rules?
    options: [README.md, AGENTS.md, CONTRIBUTING.md]
    answer: 1
    explain: "\`AGENTS.md\` is loaded automatically; keep durable rules there."
  - q: Which of these belong in a good task prompt?
    options: [Goal, Context, Your favourite colour, Done-when criteria]
    answer: [0, 1, 3]
    explain: Goal, context, constraints and a clear finish line.
`,
};
