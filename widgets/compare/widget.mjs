import { z } from "zod";
import { esc } from "../../build/util.mjs";

const side = z.object({
  prompt: z.string().describe("The prompt text (verbatim)."),
  note: z.string().optional().describe("Why it works / fails."),
}).strict();

export default {
  name: "compare",
  title: "Weak vs strong prompt",
  version: "1.0.0",
  kind: "static",
  graded: false,
  description: "Two prompts side by side, a vague one and a specific one, with a note on the difference.",
  schema: z
    .object({
      title: z.string().optional().describe("Heading."),
      weak: side.describe("The vague version."),
      strong: side.describe("The improved version."),
    })
    .strict(),
  render(c) {
    const col = (kind, label, s) => `<div class="lx-compare__col lx-compare__col--${kind}">
      <div class="lx-compare__label">${kind === "weak" ? "✗" : "✓"} ${label}</div>
      <pre><code>${esc(s.prompt.trim())}</code></pre>
      ${s.note ? `<p class="lx-compare__note">${s.note}</p>` : ""}
    </div>`;
    return `<section class="lx-block">
  ${c.title ? `<div class="lx-compare__title">${c.title}</div>` : ""}
  <div class="lx-compare">${col("weak", "Vague", c.weak)}${col("strong", "Specific", c.strong)}</div>
</section>`;
  },
  example: `title: Asking for a fix
weak:
  prompt: fix the login bug
  note: No context, no constraints, no finish line.
strong:
  prompt: |
    Users with + in their email can't log in (see issue #214).
    Look at src/auth/validate.ts. Keep the public API unchanged.
    Add a regression test. Done when npm test passes.
  note: Goal, context, constraints and done-when are all there.
`,
};
