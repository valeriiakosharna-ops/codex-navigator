import { z } from "zod";
import { esc } from "../../build/util.mjs";

export default {
  name: "usecase",
  title: "Use case",
  version: "1.0.0",
  kind: "static",
  graded: false,
  description: "A realistic scenario: situation → the prompt you would give Codex → what a good outcome looks like → tips.",
  schema: z
    .object({
      title: z.string().describe("Short name of the scenario."),
      who: z.string().optional().describe("Role, e.g. Backend developer, QA engineer."),
      situation: z.string().describe("What is going on."),
      prompt: z.string().describe("The prompt (kept verbatim, shown as code)."),
      outcome: z.string().optional().describe("What a good result looks like."),
      tips: z.array(z.string()).optional().describe("Practical hints."),
    })
    .strict(),
  render(c) {
    return `<article class="lx-block lx-usecase">
  <div class="lx-usecase__head">
    <div class="lx-usecase__label">Use case</div>
    <div class="lx-usecase__title">${c.title}</div>
    ${c.who ? `<div class="lx-usecase__who">${c.who}</div>` : ""}
  </div>
  <div class="lx-usecase__body">
    <div class="lx-usecase__step"><h4>Situation</h4><p>${c.situation}</p></div>
    <div class="lx-usecase__step"><h4>Prompt</h4><pre><code>${esc(c.prompt.trim())}</code></pre></div>
    ${c.outcome ? `<div class="lx-usecase__step"><h4>Good outcome</h4><p>${c.outcome}</p></div>` : ""}
    ${c.tips?.length ? `<div class="lx-usecase__step"><h4>Tips</h4><ul>${c.tips.map((t) => `<li>${t}</li>`).join("")}</ul></div>` : ""}
  </div>
</article>`;
  },
  example: `title: Fix a flaky test
who: Backend developer
situation: "\`test_checkout\` fails about once in ten CI runs."
prompt: |
  Investigate why tests/test_checkout.py::test_total fails intermittently.
  Reproduce it first (run it 50 times). Find the root cause, fix it,
  and do not change the assertion. Done when 50 consecutive runs pass.
outcome: A short root-cause explanation, a minimal diff, and the loop output.
tips:
  - Ask for the reproduction **before** the fix.
`,
};
