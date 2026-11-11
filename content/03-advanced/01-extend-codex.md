---
title: Extend Codex with MCP and skills
summary: Bring outside context in with MCP; package repeatable work as skills. Know which tool fits which job.
duration: 45 min
---

## Why this matters

Sooner or later the context Codex needs isn't in the repo: a ticket, a dashboard, internal
docs. And sooner or later you notice you keep giving the same multi-step instruction. Codex has
two extension mechanisms for these cases:

- **MCP** (Model Context Protocol) connects Codex to *external tools and data*.
- **Skills** package a *repeatable method*: a `SKILL.md` with instructions, plus optional scripts and references.

## Which mechanism?

| You keep… | Use | Example |
|---|---|---|
| …repeating project rules | **AGENTS.md** | "Use pnpm; run lint before finishing" |
| …repeating a multi-step method | **Skill** | Release notes, log triage, PR checklist |
| …copy-pasting from another system | **MCP server** | Issue tracker, docs portal, observability |

> [!TIP] From the best practices guide
> Start with one or two MCP tools that remove a frequent manual step. If you keep repeating the same
> prompt or correction, turn it into a skill.

```resource
title: MCP
url: https://learn.chatgpt.com/docs/extend/mcp
provider: OpenAI Docs
format: docs
duration: 15 min
level: advanced
focus:
  - "Two kinds of servers: STDIO (a local process started by a command) and Streamable HTTP (a URL, with bearer token or OAuth)."
  - "Adding one: `codex mcp add <name> -- <command>`, the MCP settings in the app or IDE, or `[mcp_servers.<name>]` in `config.toml`."
  - "`enabled_tools` / `disabled_tools` limit what a server exposes to the agent."
```

```resource
title: Build skills
url: https://learn.chatgpt.com/docs/build-skills
provider: OpenAI Docs
format: docs
duration: 15 min
level: advanced
focus:
  - "A skill is a folder with a required `SKILL.md`: `name`, `description`, then the instructions."
  - "Locations: `$HOME/.agents/skills` (personal) and `.agents/skills` in the repository (shared with the team)."
  - The description decides when the skill triggers. Keep each skill to one job and state when it should *not* be used.
  - "`$skill-creator` drafts a skill for you. Share skills beyond one repo as plugins."
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
outcome: A reusable skill in the repo. Next time, "write release notes for v1.5.0" is enough.
tips:
  - If you keep correcting the same thing in the output, update the skill, not your prompt.
```

```flashcards
id: extend-cards
title: MCP, skill or AGENTS.md?
cards:
  - front: Codex should read tickets from your issue tracker
    back: "**MCP.** External data that changes over time."
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
  - q: For the third time this week you paste the same 12-line procedure for triaging error logs. What should you do?
    options:
      - Add the procedure to AGENTS.md
      - Turn it into a skill
      - Connect your log system through MCP
      - Save it as a profile in config.toml
    answer: 1
    explain: A repeatable method with clear steps is a skill. MCP would bring the logs in, but it doesn't capture the procedure. AGENTS.md is for short durable rules.
  - q: Where should a skill live so every teammate who clones the repo gets it?
    options: ["`.agents/skills` in the repository", "`$HOME/.agents/skills`", "`~/.codex/config.toml`", "The root AGENTS.md"]
    answer: 0
    explain: "`$HOME/.agents/skills` is personal. The repository folder is shared through Git."
  - q: Your skill keeps triggering on unrelated requests. What do the docs suggest fixing first?
    options:
      - Add more steps to the instructions
      - Move it to `$HOME/.agents/skills`
      - Sharpen the description and say when it should not be used
      - Convert it into an MCP server
    answer: 2
    explain: Skills are matched by their description. A clear scope with explicit boundaries prevents false triggers.
```
