---
title: "Reusable workflows: skills, plugins and hooks"
summary: Turn a recurring team process into a skill people can read and maintain, share it as a plugin, and use hooks for checks that must always run.
duration: ~55 min
audience: [technical]
slug: extend-codex
---

## Why this matters

You'll notice it soon enough: you keep pasting the same multi-step instruction. Release notes,
log triage, the PR checklist. Each person on the team does it a little differently, and the output
shows it. The *Extend Codex Workflows* path calls the fix "a reusable Codex skill built around a
team process people can understand and maintain".

Codex has three mechanisms for this, and they're easy to confuse:

| You need… | Use | Example |
|---|---|---|
| A short, durable **rule** for every task | **AGENTS.md** (previous topic) | "Use pnpm; run lint before finishing" |
| A repeatable **method** with inputs and outputs | **Skill** | Release notes, incident summary, PR checklist |
| To **share** skills (and tools) beyond one repo | **Plugin** | A team toolkit installed from the directory |
| Something that must happen **every time**, not just when the model remembers | **Hook** | Block prompts containing API keys; run a check when a turn stops |

## Skills

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

> [!TIP] Skill best practices, from the docs
> Keep each skill to **one job**. Prefer instructions over scripts unless you need deterministic
> behaviour. Write imperative steps with explicit inputs and outputs. **Test prompts against the
> description** to check it triggers when it should, and only then.

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

```resource
title: Record & Replay in Codex
url: https://www.youtube.com/watch?v=ZK3JhU73W18
provider: OpenAI · YouTube
format: video
duration: 2 min
level: beginner
why: Show Codex a workflow once and turn it into a reusable skill. Useful when the process is easier to demonstrate than to describe.
```

```resource
title: Record & Replay
url: https://learn.chatgpt.com/docs/extend/record-and-replay
provider: OpenAI Docs
format: docs
duration: 5 min
```

```resource
title: openai/skills
url: https://github.com/openai/skills
provider: OpenAI · GitHub
format: repo
duration: browse
why: OpenAI's own skills catalogue. Read a curated skill such as `gh-fix-ci` to see what a well-scoped SKILL.md looks like before you write your own.
```

## Plugins

```resource
title: Plugins
url: https://learn.chatgpt.com/docs/plugins
provider: OpenAI Docs
format: docs
duration: 10 min
why: Plugins bundle skills and MCP servers into something you can install. ChatGPT and Codex share one plugin directory.
focus:
  - Where plugins work. The desktop app and the CLI's plugin browser support them; the **IDE extension doesn't**.
  - "*How permissions and data sharing work*: read this before installing a plugin that connects to company data."
  - In a managed workspace, admins decide which plugins can be installed (module 5).
```

```resource
title: openai/plugins
url: https://github.com/openai/plugins
provider: OpenAI · GitHub
format: repo
duration: browse
why: Source of OpenAI's plugins (GitHub, Slack, Linear and others). A good reference for how a plugin packages skills and connections.
```

## Hooks

Skills are followed when the model decides they apply. **Hooks** run scripts (or MCP tools) at fixed
points in the agent loop, whatever the model decides: before or after a tool call, when you submit a
prompt, when a turn stops, when a session starts or ends.

```resource
title: Hooks
url: https://learn.chatgpt.com/docs/hooks
provider: OpenAI Docs
format: docs
duration: 15 min
level: advanced
why: The events, the config shape, and how hooks are reviewed and trusted before they run.
focus:
  - "The docs' examples of what hooks are for: logging chats, **blocking prompts that contain API keys**, running a validation check when a turn stops."
  - Hooks you didn't write must be **reviewed and trusted** before they run. Admins can also ship managed hooks.
  - Several matching hooks run concurrently, so one can't stop another from starting.
```

```flashcards
id: extend-cards
title: AGENTS.md, skill, plugin or hook?
cards:
  - front: '"Always add a changelog entry" for this repo'
    back: "**AGENTS.md.** A short, durable project rule."
  - front: A 7-step incident-summary procedure you run weekly
    back: "**Skill.** A repeatable method with clear input and output."
  - front: Give five teams the same release-notes skill and the Linear connection
    back: "**Plugin.** Bundles skills and connections for installation."
  - front: Stop anyone from sending a prompt that contains an API key
    back: "**Hook** on prompt submit. It must run every time, not only when the model remembers."
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
  - q: Security wants a guarantee that every Codex turn ends with a secret scan of the changed files. What fits?
    options:
      - A line in AGENTS.md asking Codex to scan for secrets
      - A skill called secret-scan
      - A hook on the `Stop` event that runs the scanner
      - A reminder in the PR template
    answer: 2
    explain: AGENTS.md and skills depend on the model following them. A hook runs at a fixed point in the loop every time.
  - q: A teammate can't find your plugin in the IDE extension. Why?
    options:
      - The plugin must be rebuilt for the IDE
      - The IDE extension doesn't support plugins. Use the desktop app or the CLI's plugin browser
      - Plugins only work on mobile
      - Their workspace blocks all plugins
    answer: 1
    explain: The Plugins docs say directly that the IDE extension doesn't support plugins. (A workspace block is possible too, but it would show "Disabled by admin".)
```
