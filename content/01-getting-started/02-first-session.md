---
title: Your first session, safely
summary: Install, sign in, understand sandbox and approvals, and finish a first real task without surprises.
duration: ~1.5 h (incl. a 1-h recording)
---

## Why this matters

The first hour with an agent shapes your habits. Two things decide whether that hour goes
well. The first is a **clean starting point**, a Git repo you can diff and revert. The second
is the right **permissions**: what Codex may do without asking you. Get both right and you can
let Codex move fast without worrying.

```resource
title: "Codex bootcamp 101: Agentic coding (recording)"
url: https://academy.openai.com/public/videos/september-23-codex-bootcamp-101-2026-09-24
provider: OpenAI Academy
format: video
duration: ~1 h
level: beginner
access: Free OpenAI Academy account
why: The recording of OpenAI's live introductory session on agentic coding with Codex. Sign in to OpenAI Academy (it's free) to watch it.
focus:
  - Pause after the setup part and repeat it yourself before watching further.
  - Notice **when** Codex asks for approval and what triggered each request.
  - Write down any prompt structure the presenters reuse. You'll practise it in the next topic.
```

## Install and sign in

On macOS or Linux the docs give a one-line installer. The npm package works on any OS with Node.js:

```bash
# official installer (macOS / Linux)
curl -fsSL https://chatgpt.com/codex/install.sh | sh

# or with npm
npm install -g @openai/codex
```

Then open a project folder and run `codex`. On first run, choose **Sign in with ChatGPT**.
For Windows options (native app, sandbox, WSL), follow the CLI page below.

```resource
title: Codex CLI
url: https://learn.chatgpt.com/docs/codex/cli
provider: OpenAI Docs
format: docs
duration: 10 min
focus:
  - "The slash commands you'll use daily: `/status`, `/permissions`, `/model`, `/review`, `/init`."
  - The advice to make **Git checkpoints** before and after a task.
```

## Sandbox and approvals: two separate dials

- **Sandbox mode** decides *what Codex can touch*: `read-only`, `workspace-write` (edit inside the project) or `danger-full-access` (no sandbox).
- **Approval policy** decides *when Codex must ask you*: `on-request` (it asks before going outside the sandbox, e.g. network access or files outside the workspace) or `never`.

For a version-controlled project the docs recommend **Auto**, which is `workspace-write` + `on-request`.
For folders without Git they recommend `read-only`. Network access is **off** by default.

> [!WARNING] Common pitfall
> Turning on full access "just to stop the prompts" on day one. The prompts tell you what the
> agent wants to do. Learn the workflow first, then loosen permissions **per trusted repo**.

> [!CAUTION]
> Treat web content the agent reads as untrusted. Prompt injection can make an agent follow instructions hidden in a page.

```resource
title: Agent approvals & security
url: https://learn.chatgpt.com/docs/agent-approvals-security
provider: OpenAI Docs
format: docs
duration: 15 min
level: beginner
why: The authoritative list of sandbox modes, approval policies and recommended defaults.
focus:
  - The common combinations (Auto, Read-only, CI) and the flags for each.
  - "How to switch during a session with `/permissions`."
  - Why the docs call `--dangerously-bypass-approvals-and-sandbox` (alias `--yolo`) "not recommended".
```

```checklist
id: first-session
title: Before your first real task
items:
  - text: Work in a Git repository, on a fresh branch
    hint: "`git switch -c try-codex`. Now every change is a diff you can review or throw away."
  - text: Commit or stash your own unfinished changes
    hint: So you can tell your edits apart from the agent's.
  - text: Sign in and run `/status`
    hint: Check the workspace directories and the current permissions.
  - text: Keep the default Auto permissions (workspace-write + on-request)
  - text: Start with a small, verifiable task
    hint: For example, "add a unit test for function X and run it".
done: Ready. Next, learn how to phrase that task so Codex gets it right.
```

## Check yourself

```quiz
id: first-session-quiz
questions:
  - q: Codex keeps asking before it runs `npm install`. Which setting controls whether it has to ask?
    options: [Sandbox mode, Approval policy, The selected model, Reasoning effort]
    answer: 1
    explain: The sandbox defines what Codex may touch. The approval policy defines when it must ask first, and that's what you're seeing here.
  - q: What do the docs recommend for a project that is under Git?
    options:
      - "`read-only` sandbox with `on-request` approvals"
      - "`workspace-write` sandbox with `on-request` approvals (Auto)"
      - "`workspace-write` sandbox with `never` approvals"
      - "`danger-full-access` with `on-request` approvals"
    answer: 1
    explain: Auto lets Codex edit inside the project and asks before it goes beyond. `read-only` is what the docs recommend for folders *without* Git.
  - q: Why start an agent task on a fresh branch with your own changes committed?
    options:
      - The CLI won't start on a dirty working tree
      - So every agent change is a diff you can review or revert on its own
      - Branches give Codex more context about the task
      - It makes the sandbox stricter
    answer: 1
    explain: Git is your safety net and your review tool. Codex doesn't require a clean tree, but you'll want one.
  - q: Which statements about network access are true by default?
    options:
      - It is off in `workspace-write` mode
      - It is on in `workspace-write` mode, but every request needs approval
      - Content Codex fetches from the web should be treated as untrusted
      - It can only be enabled through `--yolo`
    answer: [0, 2]
    explain: Network is off by default. You can turn it on in config without `--yolo`. And whatever the agent reads from the web may carry injected instructions.
```
