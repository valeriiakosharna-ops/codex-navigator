# Authoring guide

You write **Markdown** and small **YAML blocks**. You never write HTML or JavaScript.
The build checks everything and tells you the exact file and line if something is wrong.

## Where things are

```
course.yaml                  course title, intro, grading mode (rarely touched)
pins.yaml                    which cohort sees which version (see VERSIONING.md)
content/
  01-getting-started/        a module = a folder (the number only sets the order)
    module.yaml              module title, summary, official course it navigates
    01-what-is-codex.md      a topic = one page = one Moodle activity
    images/                  pictures for this module (optional)
```

The page URL comes from the names **without numbers**: `content/01-getting-started/01-what-is-codex.md`
becomes `/getting-started/what-is-codex/`. You can renumber files to reorder them and the URL stays
the same.

> **Never rename a page that is already in Moodle**, because its URL would change. If you must
> rename the file, keep the old URL with `slug: what-is-codex` in the front matter.

## Two ways to edit

**A. In the browser (no installation).** Open the file on GitHub → ✏️ *Edit* → *Commit changes* →
choose *Create a new branch and start a pull request*. The CI check builds the course and
lists any problems. When it is green, merge. The change appears on `/preview/` a minute later.

**B. On your computer, with live preview.**

```bash
npm install        # once
npm run dev        # http://localhost:4321, reloads on every save
```

If you make a mistake, the browser shows the problem list instead of the page. Fix the file,
save, and the page comes back. To see a page exactly as Moodle will show it, open
`http://localhost:4321/__moodle/?url=/getting-started/what-is-codex/`. The simulator shows the
grade Moodle would receive.

New page from the template:

```bash
npm run new -- practical-workflows "Debugging with Codex"
```

## A page

Pages are shown as **slides**: a new slide starts at every `## heading`, at a `---` line, and at every `scenario` / `spot` block. Learners move with Back / Next, the section stepper or the arrow keys, and quizzes show one question at a time. Keep each section short (one idea, one resource or one activity). To show a page as one long scroll, set `layout: scroll` in its front matter.


````markdown
---
title: Your first session, safely          # required
summary: One sentence shown under the title.
duration: 40 min
---

## Why this matters

Plain Markdown: **bold**, `code`, [links](https://example.com), lists, tables.

> [!TIP] While you watch the video
> Callouts use GitHub alert syntax.

```resource
title: Codex 101
url: https://academy.openai.com/...
```
````

### Building blocks

Each block is a fenced code block whose language is the widget name. The full list, with live
examples and every field, is on the **Widget catalog** page of the site (`/widgets/`). Copy from
there.

| Block | Use it for | Graded |
|---|---|---|
| `resource` | Card that sends learners to the official material, with "why" and "pay attention to" | – |
| `usecase` | Situation → prompt → good outcome → tips | – |
| `compare` | Vague vs specific prompt side by side | – |
| `quiz` | Check-yourself questions (1 point each) | ✓ |
| `order` | Put steps in order (1 point, partial credit) | ✓ |
| `checklist` | Personal to-do list, remembered in the browser | – |
| `flashcards` | Flip cards for commands and terms | – |
| `scenario` | Decision scenario: branching story, investigation budget, "stop the agent in time" | ✓ (1/2/3 pt by level) |
| `spot` | Spot the problems in a diff, log or file, with severity from level 2 | ✓ (1/2/3 pt by level) |

Callouts: `> [!NOTE]`, `> [!TIP]`, `> [!IMPORTANT]`, `> [!WARNING]`, `> [!CAUTION]`, with an optional title
after the marker.

### YAML tips

- Indent with **spaces**, never tabs.
- Put text in quotes if it **starts** with a backtick, `*`, `[`, `{`, `@`, or contains `: ` (colon + space).
- Multi-line text: `prompt: |` and then indented lines.
- In `quiz`, `answer` counts from **0**: the first option is `0`. For several correct answers use a list: `answer: [0, 2]`.

### Grading

Every page with `quiz` or `order` blocks is graded. The page adds up its points and sends
*score / max* to Moodle when the learner has finished **all** graded blocks on the page. If a
block is practice only, add `graded: false` to it.

Give interactive blocks an `id:` if you might reorder them later. Saved answers are tied to it.

## Practice labs: `scenario` and `spot`

Labs test **judgement**, not tool skills. No AI and no environment: everything is checked
automatically by rules you write.

### Levels

| | Level 1 | Level 2 | Level 3 |
|---|---|---|---|
| Feedback | after every decision | at the end | at the end |
| Attempts | unlimited | 2 | 1 |
| Typical content | 2–3 clear options | 4–5 options, distractors, delayed consequences | ambiguity, investigation budget, live agent stream |
| `spot` | number of problems shown | severity required, decoys | severity required, decoys, 1 attempt |

Chain levels with `unlock: { after: <id of previous level> }`. The next level opens at ≥ 70% (`min:`)
or once the previous level's attempts are used up, so nobody gets stuck.

### Writing a scenario

A scenario is a set of **steps**. Each step has a `situation` and exactly one of:

- `choices`: each choice has a `rating` (`optimal`, `acceptable`, `risky` or `critical`), an `explain` (shown in the debrief), and either `next: <step>` or `end: true`;
- `stream`: agent output shown line by line. Mark the first line where things go wrong with `red: true`. The learner should press **Stop** on that line or the next one;
- `ending: true`: the final narrative.

Optional tools for harder levels:

| Field | Effect |
|---|---|
| `evidence` on a step + `budget` on the scenario | Investigation actions with a cost. Mark the essential ones `key: true`. |
| `needs: [evidence-id]` on a choice | A correct decision taken *without* checking that evidence drops one rating level. This tests evidence-before-action. |
| `sets: [flag]` + `extra: { flag: text }` or `next: { if: flag, then: a, else: b }` | Delayed consequences: an early choice changes what happens later. |
| `vars: { name: [a, b, c] }` + `{{name}}` in any text | Each learner (and each attempt) gets a different variant. Makes answers hard to share. |

**Scoring:** decision quality is the average over the path (optimal 1, acceptable 0.5, risky and critical 0).
With investigation, the score is 60% decisions + 25% key evidence checked + 15% efficiency (budget not wasted).
Any critical decision caps the attempt at 30%. The best attempt counts.

Changing the steps, choices, ratings or scoring of a practice that is already live? Add or bump `version: 2` (see docs/VERSIONING.md). Wording fixes need no bump.

The build checks the scenario for you: missing steps, loops, unreachable steps, undefined `{{vars}}`,
and `needs` that point to non-existent evidence.

### Writing a spot task

Put the content in `code: |2`. The `2` keeps lines that start with a space, which matters for diffs.
List each planted problem with its `line` (and `to` for a range), `severity`, `label` and `explain`.
Add `decoys` for lines that look wrong but aren't, so learners learn from their false alarms.
Scoring: found = 1, found with the wrong severity = 0.6, each false alarm −0.34, divided by the
number of problems.

## Error codes

| Code | Meaning | Fix |
|---|---|---|
| LX-B101 | YAML syntax error inside a block | Check indentation and quotes on the reported line |
| LX-B102 | Block field missing or wrong type | The message names the field, e.g. `questions.0.answer` |
| LX-B103 | Unknown callout type | Use NOTE, TIP, IMPORTANT, WARNING or CAUTION |
| LX-B104 | Link to a `.md` page that does not exist | Check the relative path |
| LX-B105 | Image file not found | Check the path relative to the page |
| LX-B106 | Front matter or `module.yaml` invalid | `title` is required; check the YAML |
| LX-B107 | Two pages have the same URL | Rename one file or set `slug:` |
| LX-B109 | Two blocks on a page share the same `id` | Make the ids unique |
| LX-R201/202 | A widget failed in the browser | Report to the maintainers with the page URL |

## Writing a good navigator page

1. **Why this matters**: the real-work problem, in 2–3 sentences.
2. **Official resource**: always a `resource` card. Fill in `why` and `focus`; that is the value we add.
3. **Key ideas**: short, in your own words. Don't copy official text.
4. **Use case**: how a real team uses it.
5. **Pitfall / tip** callouts.
6. **Check yourself**: 3–4 questions, each with an `explain`.
