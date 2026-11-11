---
title: Asking a coding agent for work
summary: "The four parts of a good task: goal, context, constraints, done-when. Plus when to plan first."
duration: 30 min
---

## Why this matters

Codex copes with imperfect prompts, but on large repos and high-stakes changes the quality
of your request decides the quality of the result. A good request reads like a ticket you
would hand to a capable colleague who joined yesterday.

```resource
title: Codex best practices
url: https://learn.chatgpt.com/guides/best-practices
provider: OpenAI Docs
format: docs
duration: 20 min
level: beginner
why: The official guide. This topic covers its first two sections, "context and prompts" and "plan first". Later topics come back to the rest.
focus:
  - The **four elements** of a good prompt. Memorise them.
  - When to raise or lower reasoning effort.
  - "Plan mode: `/plan` or Shift+Tab."
```

## The four elements

1. **Goal**: what you are changing or building.
2. **Context**: the relevant files, docs, examples or error messages. You can @-mention files.
3. **Constraints**: standards, architecture, safety rules or conventions to respect.
4. **Done when**: a finish line Codex can check itself, such as tests passing or a bug that no longer reproduces.

```compare
title: Same task, two prompts
weak:
  prompt: make the export faster
  note: No context, no constraints, no finish line. Codex has to guess what "faster" means and where to look.
strong:
  prompt: |
    Goal: speed up CSV export in src/reports/export.py (export_orders).
    Context: exporting 50k orders takes ~40 s; profiling output is in docs/profile.txt.
    Constraints: keep the CSV format byte-identical; no new dependencies.
    Done when: tests/test_export.py passes and the benchmark script
    scripts/bench_export.py reports under 10 s.
  note: Every element is there, and "done when" lets Codex verify its own work.
```

> [!TIP] While you watch Codex 101
> Each time the presenter writes a prompt, label its parts: goal, context, constraints,
> done-when. You'll see that "done when" is the part beginners most often leave out.

## Plan first for difficult tasks

For anything multi-step or ambiguous, ask for a plan before code. Switch to plan mode
(`/plan` or Shift+Tab), or ask Codex to **interview you** with clarifying questions until the
task is concrete. Approve the plan, then let it build.

```usecase
title: Turning a fuzzy idea into a plan
who: Tech lead
situation: Product asks for "audit logging" with no spec.
prompt: |
  I need audit logging for admin actions in this service. Before writing
  any code, interview me: ask up to 8 questions about scope, storage,
  retention and privacy. Then propose a step-by-step plan with the files
  you would touch. Wait for my approval.
outcome: A short Q&A followed by a concrete plan you can edit, all before any code is written.
tips:
  - Planning is cheap. Rewriting a wrong implementation is not.
  - Save long plans to a file (a PLANS.md template) so you can continue later.
```

```order
id: prompt-anatomy
title: Build the prompt
prompt: Arrange these fragments so the prompt reads goal → context → constraints → done when.
items:
  - Add rate limiting to the public /search endpoint.
  - The handler is in api/search.ts; we already use Redis (see lib/redis.ts).
  - Don't add new dependencies; return HTTP 429 with a Retry-After header.
  - Done when the new tests in api/search.test.ts pass and npm run lint is clean.
explain: Goal first, then the context it needs, the rules it must keep, and how to know it is finished.
```

## Check yourself

```quiz
id: prompting
questions:
  - q: Which element do beginners most often leave out, so Codex can't verify its own work?
    options: [Goal, Context, Done when]
    answer: 2
    explain: Without a finish line, the agent stops when it *thinks* it is done.
  - q: When should you ask Codex to plan before coding?
    options:
      - Never. Planning wastes tokens
      - For multi-step or ambiguous tasks
      - Only when writing documentation
    answer: 1
    explain: Plan mode, or an interview, turns fuzzy work into a concrete, reviewable plan.
  - q: Which of these are good "context"?
    options:
      - The error message and stack trace
      - "@-mentions of the relevant files"
      - '"Please be careful"'
      - A link to the design doc
    answer: [0, 1, 3]
    explain: Context is concrete material the agent can use. Vague requests to "be careful" belong nowhere.
```
