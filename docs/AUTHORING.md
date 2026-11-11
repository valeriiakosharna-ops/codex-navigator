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
