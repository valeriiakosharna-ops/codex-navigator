---
title: Navigating and refactoring large codebases
summary: Map the relevant part of a big repository, trace dependencies, plan a bounded refactor and carry it out in reviewable steps, keeping the architectural context where Codex and your team can find it.
duration: ~60 min
audience: technical
---

## Why this matters

In a small repo, Codex can read everything. In a large one it can't, and neither can you. Large
refactors fail in two familiar ways. The agent changes far more than you asked for, or it changes
the right files but breaks a caller three directories away that nobody mentioned.

The fix is the same as for a human team: **map first, plan a bounded slice, execute in reviewable
steps, and write the context down** so it survives the next session.

```resource
title: Modernizing your codebase with Codex
url: https://developers.openai.com/cookbook/examples/codex/code_modernization
provider: OpenAI Cookbook
format: article
duration: 30 min
level: advanced
why: OpenAI's worked example of modernising a legacy system with the Codex CLI. It uses COBOL, but the method applies to any monolith. Everything revolves around an **ExecPlan**, a design document the agent follows and updates.
focus:
  - "The four documents per pilot flow: an ExecPlan (scope, steps, done), an overview of the legacy flow, the target design, and a **validation** plan that defines what parity means."
  - Phase 0, which sets up AGENTS.md and a PLANS.md *before* touching any code.
  - Why the cookbook picks **one bounded pilot flow** instead of "modernise the system".
```

## Step 1: map before you change

Start read-only. Ask for a map of the part you care about, with file references you can check:

```usecase
title: Mapping a payments module before a refactor
who: Backend developer
situation: You need to replace a hand-rolled currency type with the shared Money library across the billing code. Nobody knows how far the old type spreads.
prompt: |
  Read-only task, don't edit anything.
  Map every use of `LegacyAmount` in this repo: which modules create it, which only pass it
  through, which serialise it (DB, API, queues). Group the call sites by module, with file:line.
  List public APIs and stored formats that would change if the type changed.
  Finish with the 3 riskiest places and why.
outcome: A dependency map with file references, grouped by module, including the serialisation boundaries that make the refactor risky.
tips:
  - '"Don''t edit anything" (or read-only mode) makes exploration safe.'
  - Save the map to a file in the repo (for example `docs/refactor-money/map.md`) so the next session and your reviewers can use it.
```

## Step 2: plan a bounded slice

A good refactor plan names **what's in scope, what isn't, the order of steps, and how each step is
verified**. That's what the cookbook's ExecPlan is. Put it in the repo, not only in the chat.

```compare
title: Asking for the refactor
weak:
  prompt: Migrate billing to the Money library.
  note: An unbounded change touching dozens of files, with no order of steps, no stopping points and no definition of done. The result is one giant diff nobody can review.
strong:
  prompt: |
    Using docs/refactor-money/map.md, write an ExecPlan in docs/refactor-money/plan.md:
    scope = the invoices module only; out of scope = API and DB formats.
    Split it into steps that each leave the build green and can be reviewed separately.
    For each step: files, verification command, rollback.
    Stop after writing the plan and wait for my review.
  note: A bounded scope, steps that keep the build green, and a check for each one. The plan is a file the team can review and Codex can follow.
```

## Step 3: execute in reviewable steps, with goals

For multi-step work, give Codex a **goal** it can verify itself against.

```resource
title: Long-running work
url: https://learn.chatgpt.com/docs/long-running-work
provider: OpenAI Docs
format: docs
duration: 10 min
why: How `/goal` works in the desktop app, the CLI and the IDE extension, and how to write a goal Codex can check its own progress against.
focus:
  - "The three goal elements: **outcome** (the result, not the activity), **constraints**, and **verification**."
  - Start with `/plan` when the outcome isn't clear yet, then turn the refined plan into a `/goal`.
  - "Steering a running goal: pause, edit, use a side chat for a status recap, and don't give two parallel tasks write access to the same thing."
```

```resource
title: Run long tasks in Codex using goals
url: https://www.youtube.com/watch?v=rgh0hMYPcd0
provider: OpenAI · YouTube
format: video
duration: 2 min
level: beginner
```

## Keep context and parallel work organised

```resource
title: Projects and chats
url: https://learn.chatgpt.com/docs/projects
provider: OpenAI Docs
format: docs
duration: 10 min
why: How a project keeps related chats and files together, and when to use a local project folder for a codebase. Long refactors span many chats, and this is where they live.
```

```resource
title: Worktrees
url: https://learn.chatgpt.com/docs/environments/git-worktrees
provider: OpenAI Docs
format: docs
duration: 10 min
why: Worktrees give each chat its own Git checkout, so several tasks can run in parallel without touching your working copy. "Handoff" moves a chat and its code back to your local checkout when you're ready to test.
focus:
  - "Local is the foreground, Worktree the background: queue background work while you keep coding."
  - What `.worktreeinclude` is for, namely copying ignored local files such as `.env` samples into managed worktrees.
```

```resource
title: Multitasking with the Codex app
url: https://www.youtube.com/watch?v=9ohXlkbXiM4
provider: OpenAI · YouTube
format: video
duration: 3 min
level: beginner
```

> [!TIP] Where the architectural context lives
> - **In the task brief**: scope, out-of-scope, constraints. These change per task.
> - **In the repo docs** (plan, map, ADRs): decisions and findings that should outlive the chat.
> - **In AGENTS.md**: durable rules for *every* task, such as "never change public API types without an ADR". Module 4 covers it.

## Check yourself

```quiz
id: large-codebases
questions:
  - q: You're about to refactor a type used across a large monorepo. What should Codex's first task be?
    options:
      - Make the change everywhere and run the tests
      - A read-only map of where the type is used, including serialisation boundaries, saved to a file
      - Rewrite AGENTS.md
      - Increase reasoning effort to Max and ask for the whole migration
    answer: 1
    explain: Map first. You can't bound a change you can't see, and a saved map makes the plan reviewable.
  - q: Which plan step is best for a large refactor?
    options:
      - '"Migrate all modules in one commit so the codebase is never half-migrated"'
      - '"Step 2: invoices module. Build stays green. Verify with `make test-invoices`. Roll back by reverting the step''s commit."'
      - '"Step 2: fix whatever breaks"'
      - '"Step 2: let Codex decide"'
    answer: 1
    explain: Each step is bounded, keeps the build green, and has a verification command and a rollback.
  - q: Your goal says "Refactor the invoices module". What does it lack, according to the long-running-work guide?
    options:
      - Nothing, because it's short and clear
      - An outcome (rather than an activity), constraints and a way to verify
      - A deadline
      - The name of the model to use
    answer: 1
    explain: '"Refactor" is an activity. A goal names the result, the boundaries and the checks that prove it''s done, so Codex can verify its own progress.'
  - q: You want Codex to explore a risky alternative design while you keep working on your branch. What fits best?
    options:
      - Run it in your local checkout and stash your changes
      - Start the chat in a worktree, then hand it off to local only if you want to keep it
      - Give two chats write access to the same branch
      - Wait until your own work is merged
    answer: 1
    explain: A worktree is a separate checkout for background work. Handoff brings it into the foreground only when you choose to.
```
