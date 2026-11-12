---
title: Steering the agent with AGENTS.md and rules
summary: Put project rules, test procedures and review checks in layered AGENTS.md files, control commands outside the sandbox with rules, and keep personal defaults in config.toml.
duration: ~60 min
audience: technical
---

## Why this matters

```resource
title: Extend Codex Workflows
url: https://academy.openai.com/public/courses/extend-codex-workflows-4e61p
provider: OpenAI Academy
format: course
duration: ~90 min + assessment
level: intermediate
access: Free OpenAI Academy account · badge
why: The official learning path this module follows. It's for technical specialists who already use Codex and want team practices that everyone can follow and review. Its lab builds shared guidance and a reusable skill. The badge is the checkpoint at the end of this module.
focus:
  - The phrase "put shared guidance where Codex can use it and keep the evidence reviewers need". That's this topic in one line.
```

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

> [!NOTE] Optional recording
> [Codex bootcamp 201: Team workflows](https://academy.openai.com/public/videos/september-30-codex-bootcamp-201-2026-10-01)
> (OpenAI Academy, ~1 h, free account). Watch for the moments when the agent repeats a mistake.
> That's exactly what AGENTS.md should prevent.

## Review rules in AGENTS.md

Code review by Codex reads a `## Code Review Rules` section from the AGENTS.md **closest to the code
it governs**. Put repository-wide checks at the root and service-specific ones in nested files. The
docs advise keeping each rule short, explaining what to flag **and the safe path**, and leaving
formatting and lint to CI.

```compare
title: A review rule
weak:
  prompt: "- Be careful with SQL."
  note: Nobody, human or agent, can act on this. What exactly should be flagged?
strong:
  prompt: |
    ## Code Review Rules
    ### Database access
    - Flag SQL built with string concatenation or f-strings.
      Safe path: parameterised queries via db.query(sql, params).
  note: Says what to flag and what to do instead, and it sits next to the code it governs.
```

## Rules: which commands may leave the sandbox

AGENTS.md is guidance. **Rules** are enforcement. A `.rules` file under `~/.codex/rules/` (or next to
any active config layer) matches command prefixes and decides what happens when Codex wants to run
that command **outside the sandbox**: `allow`, `prompt` or `forbidden`. When several rules match, the
strictest one wins. Rules are marked **experimental** in the docs.

```python
# ~/.codex/rules/default.rules
prefix_rule(
    pattern = ["gh", "pr", "view"],
    decision = "prompt",
    justification = "Viewing PRs needs network; confirm first.",
)
prefix_rule(
    pattern = ["git", "push"],
    decision = "forbidden",
    justification = "Never push from an agent session. Open a PR from your own terminal.",
)
```

```resource
title: Rules
url: https://learn.chatgpt.com/docs/agent-configuration/rules
provider: OpenAI Docs
format: docs
duration: 10 min
why: The rule fields, how compound shell commands are split and matched, and how to test a rule file before it takes effect.
focus:
  - "`match` / `not_match` examples, which Codex checks when it loads the rules. They catch a typo before it opens a hole."
  - When you allow a command in the TUI, Codex writes it to `~/.codex/rules/default.rules`. Review that file now and then.
  - Admins can enforce restrictive rules centrally (module 5).
```

## Community examples

Real-world AGENTS.md files, skills and workflows collected by the community. They're **not
official**: read them for ideas, and don't copy anything you haven't understood.

- [awesome-codex-skills](https://github.com/composio-community/awesome-codex-skills)
- [awesome-codex-workflows](https://github.com/shinpr/awesome-codex-workflows)
- [codex-cli-best-practice](https://github.com/shanraisshan/codex-cli-best-practice)

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
  - q: One rule says `allow` for `git` and another says `forbidden` for `git push`. Codex wants to run `git push` outside the sandbox. What happens?
    options:
      - It runs, because the first rule allows git
      - It's blocked, because the strictest matching decision wins
      - Codex asks you which rule to apply
      - Rules don't apply to git
    answer: 1
    explain: When several rules match, Codex applies the most restrictive decision. The order is forbidden, then prompt, then allow.
  - q: Where should a review rule for the payments service live?
    options:
      - In the root AGENTS.md only
      - In a `## Code Review Rules` section of the AGENTS.md closest to the payments code
      - In your personal `~/.codex/config.toml`
      - In the PR description
    answer: 1
    explain: Review rules belong next to the code they govern. Repository-wide checks go in the root file.
```
