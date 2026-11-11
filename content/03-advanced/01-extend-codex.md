---
title: Extend Codex with MCP and skills
summary: Bring outside context in with MCP; package repeatable work as skills. Know which tool fits which job.
duration: 35 min
---

## Why this matters

Sooner or later the context Codex needs isn't in the repo: a ticket, a dashboard, internal
docs. And sooner or later you notice you keep giving the same multi-step instruction. Codex has
two extension mechanisms for these cases:

- **MCP** (Model Context Protocol) connects Codex to *external tools and data*.
- **Skills** package a *repeatable method*: a `SKILL.md` with instructions, plus optional scripts and context.

```resource
title: "Codex 103: Advanced Workflows and Automation"
url: https://academy.openai.com/public/clubs/builders-etkn1/resources/codex-103-advanced-workflows-and-automation-2026-03-18
provider: OpenAI Academy
format: course
level: advanced
why: The official session on long-horizon tasks, automation and scaling engineering systems with Codex.
focus:
  - Which integrations the presenters actually rely on, and how few of them there are.
  - How repeatable work gets turned into something reusable.
```

## Which mechanism?

| You keep… | Use | Example |
|---|---|---|
| …repeating project rules | **AGENTS.md** | "Use pnpm; run lint before finishing" |
| …repeating a multi-step method | **Skill** | Release notes, log triage, PR checklist |
| …copy-pasting from another system | **MCP server** | Issue tracker, docs portal, observability |

```resource
title: MCP in Codex
url: https://learn.chatgpt.com/docs/extend/mcp
provider: OpenAI Docs
format: docs
duration: 15 min
level: advanced
focus:
  - Supported transports (STDIO and Streamable HTTP, with OAuth).
  - "Setup: Settings → MCP servers in the app, or `codex mcp add` in the CLI."
  - The official advice is to start with **one or two** tools that remove a frequent manual step.
```

```resource
title: Skills and plugins
url: https://learn.chatgpt.com/docs/skills-and-plugins
provider: OpenAI Docs
format: docs
duration: 15 min
level: advanced
focus:
  - "One job per skill, with a description that says **what it does and when to use it**. That is how Codex picks it."
  - "Locations: `$HOME/.agents/skills` (personal) or `.agents/skills` in the repo (team)."
  - "`$skill-creator` helps you write a first skill. Iterate locally, then package it as a plugin to share."
```

```usecase
title: A release-notes skill
who: Team lead who writes release notes every two weeks
situation: Each release you paste the same 10-line instruction to turn merged PRs into user-facing notes.
prompt: |
  Use $skill-creator to make a skill called release-notes:
  input: a git range (e.g. v1.4.0..HEAD);
  steps: list merged PRs, group by feature/fix/internal, drop internal ones,
  rewrite titles for end users, flag anything that needs a migration note;
  output: Markdown in docs/releases/<version>.md.
  Put it in .agents/skills so the whole team gets it.
outcome: A reusable skill checked into the repo. Next time, "write release notes for v1.5.0" is enough.
tips:
  - If you keep correcting the same thing in the output, update the skill, not your prompt.
```

```flashcards
id: extend-cards
title: MCP, skill or AGENTS.md?
cards:
  - front: Codex should read tickets from your issue tracker
    back: "**MCP.** External, changing data."
  - front: '"Always add a changelog entry" for this repo'
    back: "**AGENTS.md.** A durable project rule."
  - front: A 7-step incident-summary procedure you run weekly
    back: "**Skill.** A repeatable method with clear input and output."
  - front: Look up live metrics while debugging
    back: "**MCP.** Context that lives outside the repo."
```

## Check yourself

```quiz
id: extend-quiz
questions:
  - q: The official rule of thumb for creating a skill is…
    options:
      - Create one for every task
      - If you keep repeating the same prompt or correction, make it a skill
      - Only create skills for CI
    answer: 1
    explain: Skills capture repetition. If you aren't repeating yourself, you don't need one yet.
  - q: Where do team-shared skills live?
    options: ["`.agents/skills` in the repository", "`~/Downloads`", "Inside AGENTS.md"]
    answer: 0
    explain: The repo folder means everyone who clones the project gets the skill.
  - q: How many MCP integrations does the official guide suggest starting with?
    options: [As many as possible, One or two that remove a frequent manual task, None]
    answer: 1
    explain: Start small. Each tool adds context and surface area.
```
