import { z } from "zod";

export default {
  name: "badge",
  title: "Badge checkpoint (OpenAI Academy)",
  version: "1.0.0",
  kind: "interactive",
  graded: true,
  maxScore: () => 1,
  description:
    "The learner pastes the link to an OpenAI Academy badge (issued by Accredible after the course **and** its assessment, passed with at least 80%). " +
    "The widget looks up Accredible's public record and checks the issuer, the course, that the badge isn't revoked or expired, and that it was issued to the learner. " +
    "When everything matches, the page gets full points and Moodle records the grade on its own. " +
    "For the name check, the Moodle activity passes `name` = *Full name*. Without it, the name isn't checked.",
  schema: z
    .object({
      id: z.string().describe("Stable id, e.g. `badge-get-started`."),
      course: z.string().describe("Course title as learners see it in OpenAI Academy."),
      url: z.url().describe("Link to the course in OpenAI Academy."),
      accept: z
        .array(z.string())
        .optional()
        .describe("Badge names accepted (case-insensitive, partial match). Default: the course title."),
      issuer: z.string().default("OpenAI").describe("Text that must appear in the issuer's name."),
      checkName: z.boolean().default(true).describe("Compare the name on the badge with the learner's Moodle name (when Moodle passes it)."),
      graded: z.boolean().default(true).describe("Set false to show the checker without grading."),
    })
    .strict(),
  example: `id: badge-get-started
course: Get Started with Codex
url: https://academy.openai.com/public/courses/get-started-with-codex-jkhsq
`,
};
