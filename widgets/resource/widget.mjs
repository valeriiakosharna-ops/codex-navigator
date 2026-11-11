import { z } from "zod";
import { esc, icons } from "../../build/util.mjs";

const FORMATS = ["course", "video", "docs", "live", "repo", "article"];
const LEVELS = ["beginner", "intermediate", "advanced"];

export default {
  name: "resource",
  title: "Official resource card",
  version: "1.0.0",
  kind: "static",
  graded: false,
  description:
    "The heart of a navigator page: a card that sends the learner to the official material and tells them **why** it matters and **what to pay attention to** while studying it.",
  schema: z
    .object({
      title: z.string().describe("Title of the official material."),
      url: z.url().describe("Link to the official page."),
      provider: z.string().default("OpenAI").describe("Who publishes it, e.g. OpenAI Academy, OpenAI Docs."),
      format: z.enum(FORMATS).default("docs").describe(`One of: ${FORMATS.join(", ")}.`),
      duration: z.string().optional().describe('Rough time, e.g. "45 min".'),
      level: z.enum(LEVELS).optional().describe(`One of: ${LEVELS.join(", ")}.`),
      why: z.string().optional().describe("One or two sentences: why this resource, for this topic."),
      focus: z.array(z.string()).optional().describe("While you study, pay attention to… (tips, timestamps, sections)."),
      official: z.boolean().default(true).describe("Shows the “Official” badge."),
    })
    .strict(),
  render(c) {
    const facts = [
      c.official ? '<span class="lx-chip lx-chip--official">Official</span>' : "",
      `<span class="lx-chip">${esc(c.format)}</span>`,
      c.duration ? `<span class="lx-chip">⏱ ${esc(c.duration)}</span>` : "",
      c.level ? `<span class="lx-chip">${esc(c.level)}</span>` : "",
    ].join("");
    const focus = c.focus?.length
      ? `<div class="lx-resource__focus"><h4>While you study, pay attention to</h4><ul>${c.focus.map((f) => `<li>${f}</li>`).join("")}</ul></div>`
      : "";
    return `<aside class="lx-block lx-resource" aria-label="Official resource">
  <div class="lx-resource__top">
    <div class="lx-resource__icon" aria-hidden="true">${icons[c.format] || icons.docs}</div>
    <div>
      <div class="lx-resource__provider">${esc(c.provider)}</div>
      <div class="lx-resource__title"><a href="${esc(c.url)}" target="_blank" rel="noopener">${c.title}</a></div>
      <div class="lx-resource__facts">${facts}</div>
    </div>
  </div>
  ${c.why ? `<p class="lx-resource__why">${c.why}</p>` : ""}
  ${focus}
  <a class="lx-resource__cta" href="${esc(c.url)}" target="_blank" rel="noopener">Open ${esc(c.format === "video" ? "the video" : c.format === "course" ? "the course" : "the material")} ${icons.external}</a>
</aside>`;
  },
  example: `title: "Codex 101: Introduction and Onboarding"
url: https://academy.openai.com/public/clubs/builders-etkn1/resources/codex-101-introduction-and-onboarding-2026-03-18
provider: OpenAI Academy
format: course
duration: ~1 h
level: beginner
why: The official on-ramp. Watch it once end-to-end before you install anything.
focus:
  - How the presenter phrases the **first task** — copy the structure.
  - Where approvals pop up and why.
`,
};
