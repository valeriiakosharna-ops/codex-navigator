---
title: "Make guidance durable: AGENTS.md and config"
summary: Stop repeating yourself. Put project rules in AGENTS.md and preferences in config.toml.
duration: ~1.5 h (incl. a 1-h recording)
---

## Why this matters

If you type the same instruction twice ("use pnpm", "run lint before you finish", "never touch
`migrations/`"), it belongs in a file, not in a prompt. **AGENTS.md** is an open format, a
README for agents that Codex loads automatically. **config.toml** holds your preferences: model,
reasoning effort, sandbox, approvals, profiles, MCP servers.

```resource
title: AGENTS.md
url: https://learn.chatgpt.com/docs/agent-configuration/agents-md
provider: OpenAI Docs
format: docs
duration: 10 min
level: intermediate
why: Exactly how Codex finds AGENTS.md files and combines them.
focus:
  - "Discovery: one global file in `~/.codex`, then files from the project root down to your current directory. Folders below it are not read."
  - Files closer to your current directory override earlier guidance, because they come later in the combined prompt.
  - "`AGENTS.override.md` takes precedence over `AGENTS.md` in the same folder."
  - "There's a size limit (32 KiB combined by default), so keep it short or split it into nested folders."
```

## What to put in AGENTS.md

The best practices guide recommends a **short and accurate** file covering:

- repository layout (where things live);
- how to run the project, and the exact **build / test / lint** commands;
- engineering conventions and PR expectations;
- constraints and "do-not" rules;
- how to verify that work is done.

In the CLI, `/init` generates a starter AGENTS.md. Treat it as a draft and edit it.

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
  - Link longer docs from AGENTS.md instead of pasting them in.
```

> [!IMPORTANT] Best practice
> Durable rules go in AGENTS.md (or skills, later). One-off details go in the prompt. Mixing these up is
> one of the common mistakes the official guide lists.

## Configuration layers

| Layer | File | Use for |
|---|---|---|
| Personal defaults | `~/.codex/config.toml` | Your preferred model, effort, approvals |
| Project | `.codex/config.toml` in the repo | Settings the team shares for this project (loaded **only if you trust the project**) |
| Profile | `--profile name` | Switching between setups, e.g. a careful "review" profile |
| One-off | `-c key=value` / `--config` | Trying something for a single run (highest precedence) |

```resource
title: Config basics
url: https://learn.chatgpt.com/docs/config-file/config-basic
provider: OpenAI Docs
format: docs
duration: 15 min
focus:
  - The precedence order, from CLI overrides at the top down to built-in defaults.
  - Project `.codex/` layers load only for trusted projects. This is a security feature, not a bug.
  - "Profiles: `--profile name` loads `~/.codex/name.config.toml`. Keep only the differences there."
```

```resource
title: "Codex bootcamp 201: Team workflows (recording)"
url: https://academy.openai.com/public/videos/september-30-codex-bootcamp-201-2026-10-01
provider: OpenAI Academy
format: video
duration: ~1 h
level: intermediate
access: Free OpenAI Academy account
why: OpenAI's live session on using Codex in team workflows. Watch it with this module open.
focus:
  - Which rules the presenters keep in files rather than in prompts.
  - Any moment where the agent repeats a mistake. That's exactly what AGENTS.md should prevent.
```

## Check yourself

```quiz
id: agents-md
questions:
  - q: "Your repo has AGENTS.md at the root and another one in `services/api/`. You run Codex from `services/api/`. What does Codex do?"
    options:
      - Reads only the root file, because it's the project file
      - Reads only `services/api/AGENTS.md`, the nearest one
      - Combines both, and on conflicts the `services/api/` guidance wins
      - Asks you which file to use
    answer: 2
    explain: Codex reads files from the root down to your current folder and combines them. Later (closer) files override earlier guidance.
  - q: Which of these belong in AGENTS.md rather than in a prompt?
    options:
      - The exact test and lint commands
      - '"Never edit `db/migrations/`"'
      - The stack trace of today's bug
      - Where the main modules live
    answer: [0, 1, 3]
    explain: Durable rules and facts go in AGENTS.md. Today's stack trace is one-off context for the prompt.
  - q: You committed `.codex/config.toml` with team settings, but a teammate says Codex ignores it. What's the most likely reason?
    options:
      - Project config only works in the desktop app
      - Their copy of the project is not marked as trusted
      - Personal config always overrides project config
      - The file must be called `codex.toml`
    answer: 1
    explain: Codex loads project `.codex/` layers only for trusted projects. Project config actually takes precedence over personal config.
```
