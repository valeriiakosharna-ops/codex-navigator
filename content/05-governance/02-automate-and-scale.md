---
title: Automation and CI/CD
summary: Run Codex with nobody at the keyboard using codex exec, the Codex GitHub Action and scheduled tasks. Lock down privileges and secrets, and automate only what already works by hand.
duration: ~55 min
audience: technical
slug: automate-and-scale
---

## Why this matters

Once a workflow works reliably by hand, you can stop running it by hand. Codex can run
**non-interactively** (`codex exec`), on a **schedule**, and in **parallel**. The official
guidance has one firm condition: *automate only what already works manually*.

```resource
title: Automate tasks with the Codex app
url: https://www.youtube.com/watch?v=xHnlzAPD9QI
provider: OpenAI · YouTube
format: video
duration: 4.5 min
level: beginner
focus:
  - Which tasks are scheduled, and how their results come back for review.
```

> [!NOTE] Optional recording
> [Codex bootcamp 301: Advanced automation](https://academy.openai.com/public/videos/codex-bootcamp-301-advanced-automation-2026-10-07)
> (OpenAI Academy, ~1 h, free account). Watch which tasks the presenters automate first, and which they deliberately keep manual.

## Three ways to scale

- **`codex exec`** runs Codex from scripts and CI. By default it runs in a **read-only** sandbox; give it `--sandbox workspace-write` only when it has to edit files.
- **Scheduled tasks** live on the **Scheduled** page of the desktop app (or on the web). *Skills define the method; scheduled tasks define the timing.*
- **The Codex GitHub Action** (`openai/codex-action@v1`) runs `codex exec` inside a GitHub Actions workflow, to review PRs, gate changes or prepare releases.
- **Parallel work**: use Git **worktrees** so tasks never edit the same files, and **subagents** for bounded side jobs (module 4).

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

## Codex in GitHub Actions

```resource
title: Codex GitHub Action
url: https://learn.chatgpt.com/docs/github-action
provider: OpenAI Docs
format: docs
duration: 15 min
level: advanced
why: The official action installs the Codex CLI and runs `codex exec` with the permissions you choose. The page has an example workflow that reviews new PRs and posts the result.
focus:
  - "Inputs that map to `codex exec`: `prompt` or `prompt-file` (keep prompts in `.github/codex/prompts/`), `sandbox`, `model`, `effort`, `output-file`, `codex-version`."
  - "**Manage privileges**: `safety-strategy` defaults to `drop-sudo`. The docs warn that `read-only` alone does **not** protect secrets, because Codex still runs with elevated privileges."
  - "The **security checklist** at the end. Go through it before the workflow runs on pull requests from forks."
  - Pin `codex-version` so a CLI update can't change your pipeline overnight.
```

```resource
title: openai/codex-action
url: https://github.com/openai/codex-action
provider: OpenAI · GitHub
format: repo
duration: browse
why: The action's source and examples, including running Codex as an unprivileged user.
```

> [!WARNING] Secrets in CI
> Store the API key as a GitHub secret and pass it only to the step that needs it, not as a job-wide
> environment variable. Prefer a read-only Codex step that *produces* a patch or a comment, and a
> separate step or job, with its own permissions, that *applies* it.

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
  - q: "Your workflow runs the Codex action with `sandbox: read-only`, and you conclude the API key in the job can't leak. What do the docs say?"
    options:
      - Correct, because read-only blocks everything
      - Wrong. Read-only stops file changes and network use, but Codex still runs with elevated privileges, so use `safety-strategy` (such as `drop-sudo` or an unprivileged user) and scope secrets to the step
      - Secrets are always safe in GitHub Actions
      - Read-only is only for Windows runners
    answer: 1
    explain: The *Manage privileges* section says not to rely on `read-only` alone to protect secrets.
  - q: Why pin `codex-version` in the action?
    options:
      - Newer versions are slower
      - So a CLI release can't change the pipeline's behaviour without a reviewed change
      - The action requires it
      - Pinning makes runs cheaper
    answer: 1
    explain: Left blank, the action uses the latest CLI. Pinning makes upgrades a deliberate, reviewed change, the same idea as pinning this course's versions.
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
