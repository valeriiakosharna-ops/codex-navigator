---
title: Giving Codex context and completion criteria
summary: "Brief the agent like a new colleague: goal, context, constraints, done-when. Then plan, steer, and ask for the evidence a reviewer needs."
duration: ~50 min
audience: everyone
slug: prompting-basics
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

```resource
title: Codex prompting guide
url: https://developers.openai.com/cookbook/examples/gpt-5/codex_prompting_guide
provider: OpenAI Cookbook
format: article
duration: 20 min
level: intermediate
why: OpenAI's own guide to prompting Codex models, written for people who build their own agents on top of them. Read it for the reasoning behind the advice, not as a checklist.
focus:
  - How much autonomy to give, and why the guide warns against over-prompting a capable model.
  - What it says about asking the model to plan and to report what it verified.
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

> [!TIP] In the Academy lab
> The hands-on lab in *Get Started with Codex* asks you to give Codex "the right repository context"
> and "completion criteria". Write those four headings into your first lab prompt. The finish line is
> the part people skip most.

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

## Steer while it works

You don't have to wait for a run to finish to correct it. The **Prompting** docs describe two moves:

- **Steer** adds your message to the *current* run: a change of direction, a missing detail, new information.
- **Queue** saves the message for the *next* run: a follow-up that should wait until this work is done.

For long tasks, `/goal` turns the prompt into an explicit goal (outcome, constraints, verification)
that you can pause, edit or clear while it runs. Module 3 uses it on a large refactor.

```resource
title: Prompting
url: https://learn.chatgpt.com/docs/prompting
provider: OpenAI Docs
format: docs
duration: 15 min
why: The official prompting page for Chat, ChatGPT Work and Codex. Skim the general sections, then read **Prompting Codex** closely.
focus:
  - "\"Set boundaries that prevent real problems\": what to forbid explicitly."
  - "\"Make the result ready to use\": ask for the format the next person needs."
  - Steering and queuing.
```

## Ask for evidence, not reassurance

"Done" from an agent is a claim. The official path calls the cure **evidence a reviewer can check**.
End every non-trivial task by asking for it:

```compare
title: Closing a task
weak:
  prompt: Looks good? Then we're done.
  note: You get "Yes, all done!" whether or not anything was verified.
strong:
  prompt: |
    Before you finish, report:
    - which commands you ran and their results (tests, lint, build);
    - what you did NOT verify and why;
    - files changed, with one line on each;
    - any assumption you made that I should confirm.
  note: The reviewer can check the claims in minutes, and the gaps are stated, not hidden.
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
  - q: Codex is halfway through a task when you remember the API must stay backwards-compatible. What do you do?
    options:
      - Wait until it finishes, then start a new chat with the full prompt
      - Steer the current run with the extra constraint
      - Queue the constraint for the next run
      - Stop the task and delete the branch
    answer: 1
    explain: Steering adds information to the run in progress, which is exactly what a forgotten constraint is. Queuing would apply it only after the work is already done.
  - q: Codex reports "All done, everything works." What is the most useful follow-up?
    options:
      - '"Great, thanks!"'
      - '"Are you sure?"'
      - '"List the commands you ran with their results, and what you did not verify."'
      - '"Run it again to be safe."'
    answer: 2
    explain: Ask for evidence the reviewer can check, including the gaps. "Are you sure?" just invites more reassurance.
```
