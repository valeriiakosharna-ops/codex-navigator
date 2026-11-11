---
title: Automate and scale
summary: codex exec in CI, scheduled tasks, worktrees and subagents. Plus the habits that keep it all reliable.
duration: ~1.5 h (incl. a 1-h recording)
---

## Why this matters

Once a workflow works reliably by hand, you can stop running it by hand. Codex can run
**non-interactively** (`codex exec`), on a **schedule**, and in **parallel**. The official
guidance has one firm condition: *automate only what already works manually*.

```resource
title: "Codex bootcamp 301: Advanced automation (recording)"
url: https://academy.openai.com/public/videos/codex-bootcamp-301-advanced-automation-2026-10-07
provider: OpenAI Academy
format: video
duration: ~1 h
level: advanced
access: Free OpenAI Academy account
why: The recording of OpenAI's live session on automation with Codex.
focus:
  - Which tasks the presenters automate first, and which they deliberately keep manual.
  - How people review the results of automated runs.
```

## Three ways to scale

- **`codex exec`** runs Codex from scripts and CI. By default it runs in a **read-only** sandbox; give it `--sandbox workspace-write` only when it has to edit files.
- **Scheduled tasks** live on the **Scheduled** page of the desktop app (or on the web). *Skills define the method; scheduled tasks define the timing.*
- **Parallel work**: use Git **worktrees** so tasks never edit the same files, and **subagents** for bounded side jobs such as exploration, tests or triage.

```resource
title: Non-interactive mode (codex exec)
url: https://learn.chatgpt.com/docs/non-interactive-mode
provider: OpenAI Docs
format: docs
duration: 10 min
level: advanced
focus:
  - "Output: progress goes to stderr and only the final message to stdout; `--json` streams events, `-o` writes the result to a file."
  - "In GitHub Actions the docs recommend `openai/codex-action`, and they warn against exposing API keys as job-level variables."
  - The pattern from the docs is to run Codex with read-only permissions, then apply its patch in a separate job.
```

```resource
title: Scheduled tasks
url: https://learn.chatgpt.com/docs/automations
provider: OpenAI Docs
format: docs
duration: 10 min
level: advanced
focus:
  - The CLI and IDE have no Scheduled view. Use them to prepare and test the prompt or skill first.
  - "Worktree vs. local: worktrees keep scheduled changes away from your unfinished work."
  - Tasks run unattended, so give them the narrowest access that lets them succeed.
```

```usecase
title: Nightly CI-failure triage
who: Platform engineer
situation: Every morning someone spends 30 minutes reading red CI runs.
prompt: |
  Using the ci-triage skill, look at last night's failed runs on main,
  group failures by root cause, link the first failing commit for each,
  and write a summary to docs/triage/<date>.md. Do not change code.
outcome: A short report waiting for the team each morning. People decide what to fix.
tips:
  - Run the prompt by hand for a week first. Schedule it only once the output is consistently good.
  - Keep automated runs read-only unless there is a strong reason not to.
```

## Session hygiene

- **One chat per coherent outcome.** Stay in a chat while you work on the same problem; `/fork` only when the work truly branches.
- `/resume` continues a saved chat, `/compact` summarises long context, `/status` shows the session state.
- Don't run the whole project in one chat. The context bloats and quality drops.

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
  - q: Your team wants a nightly job that drafts release notes. It has never been run by hand. What's the right next step?
    options:
      - Schedule it with full access so it never gets stuck
      - Schedule it read-only and fix problems as they appear
      - Run it manually for a while and automate once the output is consistently good
      - Write a longer prompt so the scheduled run has more guidance
    answer: 2
    explain: Automation multiplies whatever you already have. Prove the workflow manually first.
  - q: You call `codex exec "fix the lint errors"` in CI and nothing changes. Why?
    options:
      - "`codex exec` only produces plans, never edits"
      - It runs in a read-only sandbox by default
      - CI runners can't run Codex without the desktop app
      - Lint fixes need the `--review` flag
    answer: 1
    explain: "`codex exec` defaults to read-only. Use `--sandbox workspace-write` when it needs to edit, ideally in an isolated job."
  - q: Two Codex tasks have to change the same repository at the same time. What keeps them from interfering?
    options: [Running them in two terminals, Separate Git worktrees, Separate chats in the desktop app, Higher reasoning effort]
    answer: 1
    explain: Terminals and chats still share one working tree. Each worktree is a separate checkout.
  - q: Which of these are good session habits?
    options:
      - One chat per coherent outcome
      - "`/fork` when the work genuinely branches"
      - Keeping the whole project in one chat so Codex remembers everything
      - Starting a fresh chat with a short summary when an old one gets vague
    answer: [0, 1, 3]
    explain: One giant chat bloats the context and quality drops. Fork or restart deliberately.
```
