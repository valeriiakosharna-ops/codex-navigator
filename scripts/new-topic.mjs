/*
 * Create a new topic page from the navigator template.
 *
 *   npm run new -- practical-workflows "Debugging with Codex"
 *   npm run new -- "New module title" "First topic title"      (creates the module too)
 */
import fs from "node:fs";
import path from "node:path";
import { ROOT } from "../build/build.mjs";
import { slugify, stripOrder } from "../build/util.mjs";

const [moduleArg, title] = process.argv.slice(2);
if (!moduleArg || !title) {
  console.error('Usage: npm run new -- <module> "<Topic title>"\nModules: ' +
    fs.readdirSync(path.join(ROOT, "content")).map(stripOrder).join(", "));
  process.exit(1);
}

const contentDir = path.join(ROOT, "content");
const dirs = fs.readdirSync(contentDir).filter((d) => fs.statSync(path.join(contentDir, d)).isDirectory()).sort();
let modDir = dirs.find((d) => d === moduleArg || stripOrder(d) === moduleArg || stripOrder(d) === slugify(moduleArg));
if (!modDir) {
  const n = String(dirs.length + 1).padStart(2, "0");
  modDir = `${n}-${slugify(moduleArg)}`;
  fs.mkdirSync(path.join(contentDir, modDir));
  fs.writeFileSync(path.join(contentDir, modDir, "module.yaml"), `title: ${moduleArg}\nsummary: One sentence about this module.\n# official:\n#   title: Name of the official course this module navigates\n#   url: https://...\n`);
  console.log(`✓ created module content/${modDir}/`);
}

const existing = fs.readdirSync(path.join(contentDir, modDir)).filter((f) => f.endsWith(".md"));
const n = String(existing.length + 1).padStart(2, "0");
const file = path.join(contentDir, modDir, `${n}-${slugify(title)}.md`);
fs.writeFileSync(
  file,
  `---
title: ${JSON.stringify(title)}
summary: One sentence. What will the learner be able to do after this page?
duration: 30 min
---

## Why this matters

Two or three sentences: the problem this topic solves in real work.

\`\`\`resource
title: Name of the official material
url: https://learn.chatgpt.com/docs/
provider: OpenAI Docs
format: docs
duration: 15 min
why: Why this resource, for this topic.
focus:
  - What to pay attention to while studying it.
\`\`\`

## Key ideas

- Idea one
- Idea two

> [!TIP] While you study
> A hint that saves the learner time.

\`\`\`usecase
title: A realistic scenario
who: Role
situation: What is going on.
prompt: |
  The prompt you would give Codex.
outcome: What a good result looks like.
\`\`\`

## Check yourself

\`\`\`quiz
questions:
  - q: Your question?
    options: [Option A, Option B, Option C]
    answer: 0
    explain: Why A is right.
\`\`\`
`,
);
console.log(`✓ created ${path.relative(ROOT, file)}\n  URL: /${stripOrder(modDir)}/${slugify(title)}/  (run "npm run dev" to preview)`);
