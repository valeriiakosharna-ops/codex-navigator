---
title: "The Codex CLI, sandbox and approvals"
summary: Install and sign in to the CLI, choose a sandbox and an approval policy for a repository task, and check that the boundary really holds.
duration: ~45 min
audience: [technical]
slug: first-session
---

## Why this matters

The first hour with an agent shapes your habits. Two things decide whether that hour goes
well. The first is a **clean starting point**, a Git repo you can diff and revert. The second
is the right **permissions**: what Codex may do without asking you. Get both right and you can
let Codex move fast without worrying.

```resource
title: Meet the new Codex CLI
url: https://www.youtube.com/watch?v=PUBc2G0Tj5E
provider: OpenAI · YouTube
format: video
duration: 3 min
level: beginner
focus:
  - What the CLI shows while it works, and where it stops to ask you.
```

> [!NOTE] Optional recording
> [Codex bootcamp 101: Agentic coding](https://academy.openai.com/public/videos/september-23-codex-bootcamp-101-2026-09-24)
> (OpenAI Academy, ~1 h, free account) covers the same setup live, with questions from the audience.

## Install and sign in

The docs give a standalone installer for each OS. The npm package works anywhere Node.js runs:

```bash
# official installer (macOS / Linux)
curl -fsSL https://chatgpt.com/codex/install.sh | sh

# Windows (PowerShell)
powershell -ExecutionPolicy ByPass -c "irm https://chatgpt.com/codex/install.ps1 | iex"

# or with npm, on any OS
npm install -g @openai/codex
```

Then open a project folder and run `codex`. On first run, choose **Sign in with ChatGPT**.
On Windows, Codex uses the native Windows sandbox in PowerShell and the Linux sandbox in WSL2. On
Linux, install `bubblewrap` first (see the Sandbox page).

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

```resource
title: CLI customization
url: https://learn.chatgpt.com/docs/cli-customization
provider: OpenAI Docs
format: docs
duration: 3 min
why: Themes, shell completions and the prompt editor. A small thing, but it makes the CLI more pleasant every day.
```

## Sandbox and approvals: two separate dials

- **Sandbox mode** decides *what Codex can touch*: `read-only`, `workspace-write` (edit inside the project) or `danger-full-access` (no sandbox).
- **Approval policy** decides *when Codex must ask you*: `on-request` (it asks before going outside the sandbox, e.g. network access or files outside the workspace) or `never`.

For a version-controlled project the docs recommend **Auto**, which is `workspace-write` + `on-request`.
For folders without Git they recommend `read-only`. Network access is **off** by default.

```resource
title: Sandbox
url: https://learn.chatgpt.com/docs/sandboxing
provider: OpenAI Docs
format: docs
duration: 10 min
why: What the sandbox actually enforces, and how it differs between macOS, Linux/WSL2 and Windows.
focus:
  - The sandbox applies to **every command the agent spawns** (git, package managers, test runners), not only to its own file edits.
  - "Sandbox and approvals are two controls that work together: one sets the boundary, the other decides when to stop and ask."
```

Even in `workspace-write`, some paths inside the project stay **read-only**: `.git`, `.codex`,
`.agents` and `.aws`. The agent can't rewrite your Git history or its own configuration without
asking.

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

## Prove the boundary holds

The unit's goal isn't only to *pick* permissions. It's to **check** that they stop work outside the
boundary. In a scratch repository, try this once:

1. Start `codex` with the default (Auto) and run `/status`. Note the writable roots.
2. Ask: *"Create `notes.txt` in the parent folder of this repo."* Codex should stop and ask for approval. Decline it.
3. Ask: *"Run `curl -I https://example.com` in the terminal."* Command network access is off by default, so it should ask or fail. It must not quietly succeed. (Codex's separate web-search tool is configured on its own, so test with a command.)
4. Restart with `codex --sandbox read-only` and ask it to fix a typo. It can read and propose, but it must ask before writing.

If any step goes through without a prompt, your config (or a profile you forgot about) is looser
than you think. Check `~/.codex/config.toml`.

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
  - text: Run the four boundary checks above once
    hint: Writing outside the repo and running a network command should both stop for approval.
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
  - q: In the default `workspace-write` mode, Codex wants to rewrite something inside `.git` in your project. What happens?
    options:
      - It just does it, because `.git` is inside the workspace
      - It can't write there without approval, because `.git` stays read-only even inside a writable workspace
      - It deletes `.git` and re-clones the repository
      - Codex refuses to work in repositories that have a `.git` folder
    answer: 1
    explain: The docs list protected paths (`.git`, `.codex`, `.agents`, `.aws`) that stay read-only inside writable roots.
  - q: You ask Codex to write a file outside the repo and it does so without any prompt. What's the most likely explanation?
    options:
      - That's the default behaviour of Auto
      - A config file or profile is looser than you thought, for example `danger-full-access` or approvals set to `never`
      - The model ignored the sandbox
      - Writing outside the repo is always allowed for text files
    answer: 1
    explain: The sandbox is enforced by the OS, not by the model's good behaviour. If the boundary didn't hold, check what config actually loaded (`/status`).
```
