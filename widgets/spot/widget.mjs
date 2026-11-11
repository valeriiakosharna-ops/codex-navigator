import { z } from "zod";

const SEVERITIES = ["critical", "major", "minor"];

const issue = z
  .object({
    line: z.number().int().min(1).describe("Line number (1-based) where the problem is."),
    to: z.number().int().min(1).optional().describe("Last line, if the problem spans several lines."),
    severity: z.enum(SEVERITIES).default("major").describe(`One of: ${SEVERITIES.join(", ")}.`),
    label: z.string().describe("Short name of the problem."),
    explain: z.string().describe("Why it is a problem / what to do instead."),
  })
  .strict();

export const spotSchema = z
  .object({
    id: z.string().regex(/^[a-z0-9-]+$/).describe("Required: used for saving progress and unlocking."),
    title: z.string().describe("Task name."),
    level: z.union([z.literal(1), z.literal(2), z.literal(3)]).describe("1 guided · 2 realistic · 3 expert."),
    prompt: z.string().describe("What the learner should look for."),
    view: z.enum(["diff", "log", "code", "text"]).default("code").describe("How to display the content (diff colours + / - lines)."),
    filename: z.string().optional().describe("Shown above the content."),
    code: z.string().describe("The content to review, verbatim. For diffs write `code: |2` so lines starting with a space keep it."),
    issues: z.array(issue).min(1).describe("The planted problems."),
    decoys: z.array(z.object({ line: z.number().int().min(1), explain: z.string() }).strict()).optional()
      .describe("Lines that look suspicious but are fine — explained if the learner flags them."),
    severity: z.boolean().optional().describe("Learner must also rate severity. Default: off on L1, on for L2/L3."),
    showCount: z.boolean().optional().describe("Tell how many problems there are. Default: only on L1."),
    attempts: z.number().int().min(0).optional().describe("0 = unlimited. Defaults: L1 unlimited, L2 2, L3 1."),
    points: z.number().positive().optional().describe("Points in Moodle. Default = level."),
    unlock: z.object({ after: z.string(), min: z.number().min(0).max(1).default(0.7) }).strict().optional()
      .describe("Stay locked until widget `after` reaches `min`."),
    graded: z.boolean().default(true),
    version: z.number().int().min(1).default(1)
      .describe("Practice version. Bump it when you change the code lines, issues or scoring; saved attempts restart, best score is kept."),
  })
  .strict()
  .superRefine((s, ctx) => {
    const n = s.code.replace(/\n$/, "").split("\n").length;
    const taken = new Map();
    s.issues.forEach((it, i) => {
      const to = it.to ?? it.line;
      if (it.line > n || to > n) ctx.addIssue({ code: "custom", path: ["issues", i, "line"], message: `line ${to} is outside the content (it has ${n} lines)` });
      if (to < it.line) ctx.addIssue({ code: "custom", path: ["issues", i, "to"], message: "`to` must be ≥ `line`" });
      for (let l = it.line; l <= to; l++) {
        if (taken.has(l)) ctx.addIssue({ code: "custom", path: ["issues", i, "line"], message: `line ${l} already belongs to issue ${taken.get(l) + 1}` });
        taken.set(l, i);
      }
    });
    (s.decoys || []).forEach((d, i) => {
      if (d.line > n) ctx.addIssue({ code: "custom", path: ["decoys", i, "line"], message: `line ${d.line} is outside the content` });
      if (taken.has(d.line)) ctx.addIssue({ code: "custom", path: ["decoys", i, "line"], message: `line ${d.line} is also an issue` });
    });
  });

export default {
  name: "spot",
  title: "Spot the problems",
  version: "1.1.0",
  kind: "interactive",
  graded: true,
  maxScore: (d) => d.points ?? d.level,
  structure: (d) => ({
    level: d.level, points: d.points ?? null, severity: d.severity ?? null,
    lines: d.code.replace(/\n$/, "").split("\n").length,
    issues: d.issues.map((i) => [i.line, i.to ?? null, i.severity]),
    decoys: (d.decoys || []).map((x) => x.line),
  }),
  description:
    "Learners review a diff, log or file and click the lines that are wrong (and, from level 2, rate how serious each problem is). Scoring rewards finding planted problems, correct severity, and penalises false alarms. The debrief explains every problem and every decoy.",
  schema: spotSchema,
  example: `id: demo-spot
title: Review the agent's change
level: 1
prompt: Codex says it "fixed the login timeout". Find the problems before you approve.
view: diff
filename: src/auth/session.ts
code: |2
   export const SESSION_TTL = 60 * 60;
  -const RETRIES = 3;
  +const RETRIES = 30;
   export function login(user, password) {
  +  console.log("login", user, password);
     return api.post("/login", { user, password });
   }
issues:
  - line: 3
    severity: major
    label: Unexplained retry increase
    explain: 30 retries hides the real problem and can hammer the API. Ask why.
  - line: 5
    severity: critical
    label: Password written to logs
    explain: Secrets must never be logged. Reject this change.
`,
};
