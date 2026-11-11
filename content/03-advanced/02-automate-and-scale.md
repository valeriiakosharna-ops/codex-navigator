---
title: Automate and scale
summary: codex exec in CI, scheduled tasks, worktrees and subagents. Plus the habits that keep it all reliable.
duration: 40 min
---

## Why this matters

Once a workflow works reliably by hand, you can stop running it by hand. Codex can run
**non-interactively** (`codex exec`), on a **schedule**, and in **parallel**. The official
guidance has one firm condition: *automate only what already works manually*.

```resource
title: "Codex bootcamp 301: Advanced automation (replay)"
url: https://academy.openai.com/home/videos/codex-bootcamp-301-advanced-automation-2026-10-07
provider: OpenAI Academy
format: video
duration: 1 h
level: advanced
why: The live session on automation, recorded. Good to watch after Codex 103.
focus:
  - Which tasks they automate first, and which they deliberately keep manual.
  - How results of automated runs are reviewed by people.
```

## Three ways to scale

- **`codex exec`** runs Codex from scripts and CI. For CI the docs suggest `read-only` sandbox with approvals set to `never`.
- **Scheduled tasks** (desktop app → Scheduled): choose a project, prompt, cadence and environment. *Skills define the method; scheduled tasks define the timing.*
- **Parallel work**: use Git **worktrees** so live tasks never edit the same files, and **subagents** for bounded side jobs such as exploration, tests or triage.

```resource
title: Scheduled tasks (automations)
url: https://learn.chatgpt.com/docs/automations
provider: OpenAI Docs
format: docs
duration: 10 min
level: advanced
focus:
  - "Good first candidates: commit summaries, CI-failure checks, release-note drafts, standup summaries."
  - Running a task in a dedicated worktree versus locally.
```

```usecase
title: Nightly CI-failure triage
who: Platform engineer
situation: Every morning someone spends 30 minutes reading red CI runs.
prompt: |
  Using the ci-triage skill, look at last night's failed runs on main,
  group failures by root cause, link the first failing commit for each,
  and post a summary to docs/triage/<date>.md. Do not change code.
outcome: A short report waiting for the team each morning. Humans decide what to fix.
tips:
  - Run the prompt by hand for a week first. Schedule it only once the output is consistently good.
  - Keep automated runs read-only unless there is a strong reason not to.
```

## Session hygiene

- **One chat per coherent outcome.** Stay in a chat while you work on the same problem; `/fork` only when the work truly branches.
- `/resume` continues a saved chat, `/compact` summarises long context, `/status` shows the session state.
- Don't run one chat for the whole project. Context bloats and quality drops.

```checklist
id: automation-ready
title: Is this workflow ready to automate?
items:
  - It has produced good results manually several times in a row
  - The method lives in a skill (not a long pasted prompt)
  - Project rules are in AGENTS.md
  - It runs with the narrowest permissions that work (ideally read-only)
  - A person reviews the output before anything ships
  - It runs in its own worktree if it edits files
done: Go ahead and schedule it, and check the first few runs closely.
```

> [!WARNING] The official "common mistakes" list, in short
> Durable rules kept in prompts · no documented build/test commands · skipping planning ·
> full permissions too early · parallel tasks without worktrees · scheduling before it works
> manually · babysitting instead of working in parallel · one giant chat for everything.

## Check yourself

```quiz
id: automate
questions:
  - q: What must be true before you schedule a workflow?
    options:
      - It uses the most powerful model
      - It already works reliably when run manually
      - It has full access permissions
    answer: 1
    explain: Automation multiplies whatever you already have, good or bad.
  - q: Two Codex tasks need to edit the same repository at the same time. What prevents them from stepping on each other?
    options: [Two terminals, Git worktrees, Higher reasoning effort]
    answer: 1
    explain: Each worktree is a separate checkout, so the tasks don't edit the same files.
  - q: Which split of responsibilities matches the official guidance?
    options:
      - Scheduled tasks define the method; skills define the timing
      - Skills define the method; scheduled tasks define the timing
    answer: 1
    explain: The skill holds the how; the schedule holds the when.
  - q: Which are signs of good session hygiene?
    options:
      - One chat per coherent outcome
      - "Using `/fork` when work truly branches"
      - One chat for the entire project
    answer: [0, 1]
    explain: Giant chats bloat context. Fork only when the work diverges.
```
