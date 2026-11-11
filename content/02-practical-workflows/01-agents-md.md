---
title: "Make guidance durable: AGENTS.md and config"
summary: Stop repeating yourself. Put project rules in AGENTS.md and preferences in config.toml.
duration: 35 min
---

## Why this matters

If you type the same instruction twice ("use pnpm", "run lint before you finish", "never touch
`migrations/`"), it belongs in a file, not in a prompt. **AGENTS.md** is an open format, a
README for agents that Codex loads automatically. **config.toml** holds your preferences
for model, reasoning effort, sandbox, approvals, profiles and MCP servers.

```resource
title: AGENTS.md
url: https://learn.chatgpt.com/docs/agent-configuration/agents-md
provider: OpenAI Docs
format: docs
duration: 15 min
level: intermediate
why: How Codex discovers AGENTS.md files and which one wins when there are several.
focus:
  - "The three levels: global (`~/.codex`), repository root, and subdirectories. The file nearest your working directory takes precedence."
  - "`/init` generates a starter file. Treat it as a draft and edit it."
```

```resource
title: "Codex 102: Practical Workflows"
url: https://academy.openai.com/public/clubs/builders-etkn1/resources/codex-102-practical-workflows-2026-03-18
provider: OpenAI Academy
format: course
level: intermediate
why: The official session on understanding codebases, refactoring and shipping features with Codex. Watch it with this module open.
focus:
  - How the presenters keep the agent on track over long tasks. Much of it comes from good AGENTS.md files.
  - Any moment where the agent repeats a mistake. That is exactly what AGENTS.md should prevent.
```

## What to put in AGENTS.md

A useful AGENTS.md is **short and accurate**. Cover:

- repository layout (where things live);
- how to run the project, and the exact **build / test / lint** commands;
- engineering conventions and PR expectations;
- constraints and "do-not" rules;
- how to verify that work is done.

```usecase
title: Writing your team's first AGENTS.md
who: Developer on a team of six
situation: Codex keeps running `npm test` (the whole suite, 9 minutes) and forgets the lint step.
prompt: |
  Run /init, then edit the generated AGENTS.md so it says:
  - use pnpm, never npm;
  - for a quick check run `pnpm test --filter <package>`; full suite only before a PR;
  - always run `pnpm lint` before declaring the task done;
  - never edit files under db/migrations/ — propose a new migration instead.
  Keep it under 40 lines.
outcome: A short AGENTS.md checked into the repo. Every teammate's Codex now follows the same rules.
tips:
  - When Codex repeats a mistake, ask it to review what went wrong and propose an AGENTS.md update.
  - Link longer docs (e.g. `docs/code_review.md`) from AGENTS.md instead of pasting them in.
```

> [!IMPORTANT] Best practice
> Durable rules go in AGENTS.md (or skills, later). One-off details go in the prompt. Mixing these up is
> one of the most common mistakes the official guide lists.

## Configuration layers

| Layer | File | Use for |
|---|---|---|
| Personal defaults | `~/.codex/config.toml` | Your preferred model, effort, approvals |
| Repository | `.codex/config.toml` | Settings the whole team should share for this repo |
| One-off | CLI flags | Trying something for a single run |

```resource
title: Configuration
url: https://learn.chatgpt.com/docs/configuration
provider: OpenAI Docs
format: docs
duration: 15 min
focus:
  - Profiles, so you can switch between, say, a careful "review" setup and a fast "spike" setup.
  - The docs note that many quality problems are really environment problems (wrong directory, missing tools, no write access).
```

## Check yourself

```quiz
id: agents-md
questions:
  - q: You have a global AGENTS.md and one in `services/api/`. You are working inside `services/api/`. Which guidance takes precedence?
    options: [The global one, The one in services/api/, Whichever is longer]
    answer: 1
    explain: The file closest to your working directory wins.
  - q: Which of these belong in AGENTS.md?
    options:
      - The exact test and lint commands
      - '"Never edit db/migrations/"'
      - Today's bug description
      - Repository layout
    answer: [0, 1, 3]
    explain: Today's bug is a one-off detail. It belongs in the prompt.
  - q: Where do settings live that the whole team should share for one repository?
    options: ["`~/.codex/config.toml`", "`.codex/config.toml` in the repo", "A CLI flag"]
    answer: 1
    explain: The repository-level config is committed together with the code.
```
