---
title: Your first session, safely
summary: Install, sign in, understand sandbox and approvals, and finish a first real task without surprises.
duration: 40 min
---

## Why this matters

The first hour with an agent shapes your habits. Two things decide whether that hour goes
well: a **clean starting point**, meaning a Git repo you can diff and revert, and the right
**permissions**, meaning what Codex may do without asking you. Get both right and you can
let Codex move fast without worrying.

```resource
title: "Codex 101: Introduction and Onboarding"
url: https://academy.openai.com/public/clubs/builders-etkn1/resources/codex-101-introduction-and-onboarding-2026-03-18
provider: OpenAI Academy
format: course
level: beginner
why: The official onboarding session. It covers setup, writing code, navigating repositories and finishing real tasks, with prompting patterns along the way.
focus:
  - Pause after setup and do it yourself before watching further.
  - Notice **when** an approval prompt appears and what triggered it.
  - Write down the prompting patterns the presenter reuses. You will practise them in the next topic.
```

## Install and sign in

On macOS or Linux the docs give a one-line installer. npm also works on any OS with Node.js:

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
  - "The slash commands you will use daily: `/status`, `/permissions`, `/model`, `/review`, `/init`."
  - The advice to create **Git checkpoints** before and after a task.
```

## Sandbox and approvals: the two dials

Codex has two separate settings. People often mix them up.

- **Sandbox mode** decides *what Codex can touch*: `read-only`, `workspace-write` (edit inside the project) or `danger-full-access` (no sandbox).
- **Approval policy** decides *when Codex must ask you*: `on-request` (asks before going outside the sandbox, e.g. network or files outside the workspace) or `never`.

For a version-controlled project the recommended preset is **Auto**, which means `workspace-write` + `on-request`.
For folders without Git, stay in `read-only`. Network access is **off** by default.

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
why: The authoritative list of sandbox modes, approval policies and safe defaults.
focus:
  - The table of common combinations (Auto, Read-only, CI).
  - "How to switch during a session with `/permissions`."
  - Why `--yolo` exists and why the docs advise against it.
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
    hint: For example "add a unit test for function X and run it".
done: Ready. Next, learn how to phrase that task so Codex nails it.
```

## Check yourself

```quiz
id: first-session-quiz
questions:
  - q: Which setting controls **when Codex asks you** before acting?
    options: [Sandbox mode, Approval policy, Model, Reasoning effort]
    answer: 1
    explain: Sandbox = what it can touch. Approval policy = when it must ask.
  - q: What is the recommended default for a Git-tracked project?
    options:
      - "`danger-full-access` + `never`"
      - "`workspace-write` + `on-request` (Auto)"
      - "`read-only` + `never`"
    answer: 1
    explain: Auto lets Codex edit inside the project and asks before going beyond it.
  - q: Why work on a branch with a clean working tree?
    options:
      - Codex refuses to run otherwise
      - Every change becomes a reviewable, revertible diff
      - It makes Codex faster
    answer: 1
    explain: Git is your safety net and your review tool.
  - q: Which statements about network access are true?
    options:
      - It is off by default in workspace-write
      - It is always on
      - Content fetched from the web should be treated as untrusted
    answer: [0, 2]
    explain: Off by default. When you enable it, remember the prompt-injection risk.
```
