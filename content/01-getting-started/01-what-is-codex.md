---
title: What Codex is and where it runs
summary: Codex is OpenAI's coding agent. Learn the surfaces it runs on and pick the right one for each kind of task.
duration: 25 min
---

## Why this matters

Codex is a *coding agent*. It doesn't just suggest the next line. It reads your repository,
runs commands, edits files and reports back. You can reach the same agent from several
**surfaces**, and choosing the right one saves a lot of friction. Most people start in the
wrong place, for example running a long refactor in a terminal they then need to close.

```resource
title: Getting started with Codex
url: https://academy.openai.com/public/clubs/builders-etkn1/externals/getting-started-with-codex-2026-03-18
provider: OpenAI Academy
format: article
duration: ~15 min
level: beginner
why: The shortest official overview of what Codex does and how a first session looks. Read it before you install anything.
focus:
  - The difference between **asking** Codex something and **delegating** a task to it.
  - Which surfaces are mentioned and what each is good for. You will need this table below.
  - How results come back to you (chat answer, diff, pull request).
```

## The surfaces at a glance

| Surface | Where it runs | Best for |
|---|---|---|
| **Desktop app** | Your machine, with a project folder | Longer tasks, reviewing diffs visually, running several chats in parallel |
| **IDE extension** | Inside your editor | Working next to the code you are already editing |
| **CLI** (`codex`) | Your terminal | Fast keyboard-driven work, scripting, CI via `codex exec` |
| **Cloud / web** | OpenAI's cloud environment | Delegating tasks that run on their own while you do something else |

> [!TIP] Rule of thumb
> Pair-programming on code in front of you: use the **IDE**. Batch work and automation: use the **CLI**.
> "Go do this and come back with a PR": use **cloud**.

```resource
title: Codex documentation — Quickstart
url: https://learn.chatgpt.com/docs/quickstart
provider: OpenAI Docs
format: docs
duration: 10 min
why: The official starting point in the docs. It links to every surface page (app, IDE, CLI, cloud).
focus:
  - Sign-in options. A ChatGPT account is the default; an API key works but some features may be unavailable.
  - Where the docs send *developers* (CLI and IDE pages) versus general users.
```

## How teams actually use it

```usecase
title: Onboarding into an unfamiliar repository
who: Developer joining a new project
situation: You have just cloned a service you have never seen and need to fix a bug in it tomorrow.
prompt: |
  Explain this repository to me: the main modules, how a request flows
  from the HTTP layer to the database, and how to run the tests locally.
  Don't change any files.
outcome: A map of the codebase with file references, plus the exact test command. Nothing is modified.
tips:
  - Ending with "Don't change any files" (or switching to read-only) makes exploration safe.
  - Ask follow-ups in the same chat. The context you built up is the value.
```

```flashcards
id: surfaces
title: Which surface would you pick?
cards:
  - front: Refactor a module while you keep coding in your editor
    back: "**IDE extension.** The agent works next to the files you have open."
  - front: Run Codex in a CI pipeline to summarise failures
    back: "**CLI** with `codex exec`, the non-interactive mode for scripts and CI."
  - front: Kick off a task, close your laptop, review the result later
    back: "**Cloud.** The task runs in a cloud environment, not on your machine."
  - front: Compare diffs from three parallel attempts
    back: "**Desktop app.** Parallel chats and a visual diff panel."
```

## Check yourself

```quiz
id: what-is-codex
questions:
  - q: What makes Codex an *agent* rather than autocomplete?
    options:
      - It writes code faster
      - It can read the repo, run commands and edit files to complete a task
      - It only works in the cloud
    answer: 1
    explain: An agent acts. It explores, runs commands, changes files and reports back.
  - q: You want Codex to work on a task while your laptop is closed. Which surface?
    options: [CLI, IDE extension, Cloud]
    answer: 2
    explain: Cloud tasks run in OpenAI's environment, independent of your machine.
  - q: Which command runs Codex non-interactively, e.g. in CI?
    options: ["`codex exec`", "`codex chat`", "`codex ci`"]
    answer: 0
    explain: "`codex exec` is the documented non-interactive mode for scripts and automation."
```
