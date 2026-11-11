---
title: Asking a coding agent for work
summary: "The four parts of a good task: goal, context, constraints, done-when. Plus when to plan first."
duration: 35 min
---

## Why this matters

Codex copes with imperfect prompts, but on large repos and high-stakes changes the quality of
your request decides the quality of the result. A good request reads like a ticket you'd hand
to a capable colleague who joined yesterday.

```resource
title: Codex best practices
url: https://learn.chatgpt.com/guides/best-practices
provider: OpenAI Docs
format: docs
duration: 20 min
level: beginner
why: 'The official guide. This topic covers its first two sections, “Strong first use: Context and prompts” and “Plan first for difficult tasks”. Later topics come back to the rest.'
focus:
  - The **four elements** of a good prompt.
  - When to raise or lower reasoning effort.
  - "Plan mode: `/plan` or Shift+Tab, or asking Codex to interview you first."
```

## The four elements

1. **Goal**: what you're changing or building.
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

> [!TIP] While you watch the bootcamp recording
> Each time a presenter writes a prompt, label its parts: goal, context, constraints, done-when.
> Note which parts are missing. The finish line is the one people skip most.

## Plan first for difficult tasks

For anything multi-step or ambiguous, ask for a plan before code. Switch to plan mode
(`/plan` or Shift+Tab), or ask Codex to **interview you** until the task is concrete. Approve
the plan, then let it build.

```usecase
title: Turning a fuzzy idea into a plan
who: Tech lead
situation: Product asks for "audit logging" with no spec.
prompt: |
  I need audit logging for admin actions in this service. Before writing
  any code, interview me: ask up to 8 questions about scope, storage,
  retention and privacy. Then propose a step-by-step plan with the files
  you would touch. Wait for my approval.
outcome: A short Q&A, then a concrete plan you can edit, all before any code is written.
tips:
  - Planning is cheap. Rewriting a wrong implementation is not.
  - Save long plans to a file (the guide suggests a PLANS.md template) so you can continue later.
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
explain: Goal first, then the context it needs, the rules it must keep, and how to know it's finished.
```

## Check yourself

```quiz
id: prompting
questions:
  - q: 'A prompt says: "Refactor `billing/` to use the new money type. Keep the public API unchanged." What is missing for Codex to verify its own work?'
    options: [A goal, Context, A constraint, A done-when criterion]
    answer: 3
    explain: The goal and a constraint are there, and the folder is context. Nothing says how to know it's finished, for example "all billing tests pass".
  - q: Which task benefits most from asking for a plan before any code?
    options:
      - Renaming a variable across one file
      - Adding audit logging to a service with no spec yet
      - Fixing a typo in an error message
      - Running the test suite and reporting failures
    answer: 1
    explain: Plan mode, or an interview, pays off when a task is multi-step or ambiguous. Small, well-defined edits don't need it.
  - q: Which of these count as useful *context* for a bug fix?
    options:
      - The failing test's output and stack trace
      - "@-mentions of the files involved"
      - '"Be careful, this is production code"'
      - A link to the issue describing the expected behaviour
    answer: [0, 1, 3]
    explain: Context is concrete material Codex can use. "Be careful" is a mood, not information. Turn it into a constraint, for example "don't change the public API".
```
