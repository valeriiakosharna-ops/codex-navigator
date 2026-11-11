import { z } from "zod";

const RATINGS = ["optimal", "acceptable", "risky", "critical"];
const rating = z.enum(RATINGS);
const stepId = z.string().regex(/^[a-z0-9-]+$/, "step ids use lowercase letters, digits and dashes");
const next = z.union([
  stepId,
  z.object({ if: z.string().describe("Flag name."), then: stepId, else: stepId }).strict(),
]);

const choice = z
  .object({
    text: z.string().describe("What the learner can do."),
    rating: rating.describe(`How good this decision is: ${RATINGS.join(" / ")}. Critical caps the score at 30%.`),
    explain: z.string().optional().describe("Why — shown in feedback / debrief."),
    consequence: z.string().optional().describe("What happens next in the story (shown right after choosing)."),
    next: next.optional().describe("Next step id, or `{ if: flag, then: a, else: b }`."),
    end: z.boolean().optional().describe("This choice ends the scenario."),
    needs: z.array(z.string()).optional().describe("Evidence ids the learner should have checked first; otherwise the rating drops one level."),
    sets: z.array(z.string()).optional().describe("Flags to remember for later steps (delayed consequences)."),
  })
  .strict()
  .refine((c) => !!c.next !== !!c.end, { message: "each choice needs exactly one of `next` or `end: true`" });

const evidence = z
  .object({
    id: z.string().regex(/^[a-z0-9-]+$/).describe("Unique id (used by `needs`)."),
    label: z.string().describe('The action, e.g. "Run git status".'),
    output: z.string().describe("What the learner sees (shown as terminal/code)."),
    key: z.boolean().default(false).describe("Key evidence — an expert would check it."),
    cost: z.number().int().min(0).default(1).describe("Budget units this action costs."),
  })
  .strict();

const stream = z
  .object({
    lines: z.array(z.object({ text: z.string(), red: z.boolean().optional() }).strict()).min(3)
      .describe("Agent activity, shown line by line. Mark the first problematic line with `red: true`."),
    autoplay: z.boolean().optional().describe("Lines appear by themselves (default on level 3)."),
    speed: z.number().int().min(500).default(1800).describe("Autoplay delay in ms."),
    outcomes: z
      .object({
        onTime: z.string().optional(),
        late: z.string().optional(),
        early: z.string().optional(),
        missed: z.string().optional(),
      })
      .strict()
      .default({})
      .describe("Story text for: stopped on time / late / too early / never."),
    missRating: rating.default("critical").describe("Rating when the learner never stops the agent."),
    next: next.optional(),
    end: z.boolean().optional(),
  })
  .strict()
  .refine((s) => s.lines.some((l) => l.red), { message: "mark at least one line with `red: true`" })
  .refine((s) => !!s.next !== !!s.end, { message: "stream needs exactly one of `next` or `end: true`" });

const step = z
  .object({
    title: z.string().optional().describe("Short label used in the debrief."),
    situation: z.string().describe("What the learner sees at this point."),
    extra: z.record(z.string(), z.string()).optional().describe("Extra paragraph shown when a flag is set: `{ flag: text }`."),
    evidence: z.array(evidence).optional().describe("Investigation actions available here (cost budget)."),
    choices: z.array(choice).min(2).optional(),
    stream: stream.optional(),
    ending: z.boolean().optional().describe("A final narrative step (no choices)."),
  })
  .strict()
  .refine((s) => [s.choices, s.stream, s.ending].filter(Boolean).length === 1, {
    message: "a step has exactly one of: `choices`, `stream`, or `ending: true`",
  });

function targets(n) {
  if (!n) return [];
  return typeof n === "string" ? [n] : [n.then, n.else];
}

export const scenarioSchema = z
  .object({
    id: z.string().regex(/^[a-z0-9-]+$/).describe("Required: used for saving progress and unlocking."),
    title: z.string().describe("Scenario name."),
    level: z.union([z.literal(1), z.literal(2), z.literal(3)]).describe("1 guided · 2 realistic · 3 expert."),
    intro: z.string().optional().describe("Briefing shown before starting."),
    budget: z.number().int().min(1).optional().describe("Investigation budget (number of evidence actions)."),
    attempts: z.number().int().min(0).optional().describe("Graded attempts; 0 = unlimited (default). After a limit, learners can still practise without changing the grade."),
    feedback: z.enum(["step", "end"]).optional().describe("Rating after each step, or only at the end. Default: L1 step, else end."),
    points: z.number().positive().optional().describe("Points in Moodle. Default = level (1/2/3)."),
    unlock: z.object({ after: z.string(), min: z.number().min(0).max(1).default(0.7) }).strict().optional()
      .describe("Stay locked until widget `after` reaches `min` (or uses all attempts)."),
    vars: z.record(z.string(), z.array(z.string()).min(1)).optional()
      .describe("Per-learner variants: `{ file: [a.ts, b.ts] }`, use as `{{file}}` in any text."),
    graded: z.boolean().default(true),
    version: z.number().int().min(1).default(1)
      .describe("Practice version. Bump it when you change steps, choices, ratings or scoring; saved attempts restart, best score is kept."),
    start: stepId.describe("Id of the first step."),
    steps: z.record(stepId, step).describe("The steps, by id."),
  })
  .strict()
  .superRefine((sc, ctx) => {
    const ids = new Set(Object.keys(sc.steps));
    const issue = (path, message) => ctx.addIssue({ code: "custom", path, message });
    if (!ids.has(sc.start)) issue(["start"], `step "${sc.start}" does not exist`);

    const evidenceIds = new Set();
    const edges = {};
    for (const [id, s] of Object.entries(sc.steps)) {
      edges[id] = [];
      (s.evidence || []).forEach((e, i) => {
        if (evidenceIds.has(e.id)) issue(["steps", id, "evidence", i, "id"], `evidence id "${e.id}" is used twice`);
        evidenceIds.add(e.id);
      });
      (s.choices || []).forEach((c, i) => {
        for (const t of targets(c.next)) {
          if (!ids.has(t)) issue(["steps", id, "choices", i, "next"], `step "${t}" does not exist`);
          else edges[id].push(t);
        }
      });
      for (const t of targets(s.stream?.next)) {
        if (!ids.has(t)) issue(["steps", id, "stream", "next"], `step "${t}" does not exist`);
        else edges[id].push(t);
      }
      if (s.evidence?.length && !sc.budget) issue(["budget"], `step "${id}" has evidence actions, so set a \`budget\``);
    }
    for (const [id, s] of Object.entries(sc.steps)) {
      (s.choices || []).forEach((c, i) =>
        (c.needs || []).forEach((n) => { if (!evidenceIds.has(n)) issue(["steps", id, "choices", i, "needs"], `evidence "${n}" does not exist`); }),
      );
    }
    // reachability + cycles (scenarios must always finish)
    const seen = new Set(), stack = new Set();
    const visit = (id, trail) => {
      if (stack.has(id)) { issue(["steps", id], `loop detected: ${[...trail, id].join(" → ")}`); return; }
      if (seen.has(id)) return;
      seen.add(id); stack.add(id);
      for (const t of edges[id] || []) visit(t, [...trail, id]);
      stack.delete(id);
    };
    if (ids.has(sc.start)) visit(sc.start, []);
    for (const id of ids) if (!seen.has(id)) issue(["steps", id], `step "${id}" can never be reached from "${sc.start}"`);
    // variables
    const used = JSON.stringify(sc.steps).match(/\{\{(\w+)\}\}/g) || [];
    for (const u of new Set(used)) {
      const name = u.slice(2, -2);
      if (!sc.vars || !sc.vars[name]) issue(["vars"], `{{${name}}} is used but not defined in \`vars\``);
    }
  });

export default {
  name: "scenario",
  title: "Decision scenario",
  version: "1.2.0",
  kind: "interactive",
  graded: true,
  maxScore: (d) => d.points ?? d.level,
  /** What saved progress depends on. Wording changes don't count; structure changes do. */
  structure: (d) => ({
    level: d.level, points: d.points ?? null, budget: d.budget ?? null, start: d.start,
    vars: Object.fromEntries(Object.entries(d.vars || {}).map(([k, v]) => [k, v.length])),
    steps: Object.fromEntries(Object.entries(d.steps).map(([k, s]) => [k, {
      c: (s.choices || []).map((c) => [c.rating, c.next ?? null, !!c.end, c.needs || [], c.sets || []]),
      e: (s.evidence || []).map((e) => [e.id, e.key, e.cost]),
      s: s.stream ? [s.stream.lines.length, s.stream.lines.findIndex((l) => l.red), s.stream.next ?? null, s.stream.missRating] : null,
      end: !!s.ending,
    }])),
  }),
  description:
    "A situation that unfolds step by step. The learner decides, investigates with a limited budget, or stops an agent at the right moment. Scoring looks at the **whole path**: decision quality, whether key evidence was checked first, wasted actions, and critical mistakes. A debrief compares the path with an expert's. Three levels: 1 guided (feedback every step, unlimited attempts), 2 realistic (feedback at the end), 3 expert (budget, ambiguity, live agent stream). Practices can be retaken any number of times; the best result counts.",
  schema: scenarioSchema,
  example: `id: demo-scenario
title: The agent wants network access
level: 1
intro: You asked Codex to add a date-formatting helper to a client project.
start: ask
steps:
  ask:
    title: Network request
    situation: Codex asks for network access to run \`npm install dayjs\`.
    choices:
      - text: Approve once. The task needs the package and you can review the diff
        rating: optimal
        explain: Approving a single, understood command keeps you in control.
        next: done
      - text: Switch to full access so it stops asking
        rating: critical
        explain: That removes the sandbox for everything that follows.
        end: true
      - text: Deny and tell Codex to write the helper without a dependency
        rating: acceptable
        explain: Valid if the project avoids new dependencies. Otherwise you are slowing yourself down.
        next: done
  done:
    ending: true
    situation: The helper is added. You review the diff and commit.
`,
};
