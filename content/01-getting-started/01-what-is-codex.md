---
title: What Codex is and where it runs
summary: Codex is OpenAI's coding agent. Learn the surfaces it runs on and pick the right one for each kind of task.
duration: ~70 min (incl. a 53-min video)
---

## Why this matters

Codex is a *coding agent*. It doesn't just suggest the next line: it reads your repository,
runs commands, edits files and reports back. You can reach the same agent from several
**surfaces**, and choosing the right one saves a lot of friction. A common early mistake is
running a long task in a place you then need to close, like a terminal on a laptop you're about
to shut.

```resource
title: Getting started with Codex
url: https://www.youtube.com/watch?v=px7XlbYgk7I
provider: OpenAI · YouTube
format: video
duration: 53 min
level: beginner
why: OpenAI's own walkthrough of working with Codex. It's the best single starting point, and it's public, so no sign-in is needed.
focus:
  - Each place you see Codex run (terminal, editor, desktop app, cloud). You'll need this list for the table below.
  - When the presenters **ask** Codex a question and when they **hand it a whole task**.
  - How each result comes back to them, whether as an answer, a diff or a pull request.
```

## The surfaces at a glance

| Surface | Where it runs | Best for |
|---|---|---|
| **Desktop app** | Your machine, with a project folder | Longer tasks, reviewing diffs visually, several chats in parallel |
| **IDE extension** | Inside your editor | Working next to the code you're already editing |
| **CLI** (`codex`) | Your terminal | Keyboard-driven work, scripting, CI via `codex exec` |
| **Cloud / web** | OpenAI's cloud environment | Tasks that run on their own while you do something else |

> [!TIP] Rule of thumb
> Pair-programming on code in front of you: use the **IDE**. Scripts and automation: use the **CLI**.
> "Go do this and come back with a PR": use **cloud**.

```resource
title: Quickstart
url: https://learn.chatgpt.com/docs/quickstart
provider: OpenAI Docs
format: docs
duration: 5 min
why: The official first-steps page for the ChatGPT desktop app and the web. From there the docs point developers to the Codex CLI, the IDE extension and Codex Cloud.
focus:
  - The sign-in options. The default is a ChatGPT account; an API key also works, but some features may be unavailable.
  - Where the page sends developers next. The CLI is covered in the next topic.
```

## How teams actually use it

```usecase
title: Onboarding into an unfamiliar repository
who: Developer joining a new project
situation: You've just cloned a service you've never seen, and you need to fix a bug in it tomorrow.
prompt: |
  Explain this repository to me: the main modules, how a request flows
  from the HTTP layer to the database, and how to run the tests locally.
  Don't change any files.
outcome: A map of the codebase with file references and the exact test command. Nothing is modified.
tips:
  - '"Don''t change any files" (or read-only mode) makes exploration safe.'
  - Ask your follow-ups in the same chat. The context you built up is what makes the answers good.
```

```flashcards
id: surfaces
title: Which surface would you pick?
cards:
  - front: Refactor a module while you keep coding in your editor
    back: "**IDE extension.** The agent works next to the files you have open."
  - front: Summarise test failures automatically in a CI pipeline
    back: "**CLI** with `codex exec`, the non-interactive mode for scripts and CI."
  - front: Start a task, close your laptop, review the result later
    back: "**Cloud.** The task runs in a cloud environment, not on your machine."
  - front: Compare diffs from three parallel attempts
    back: "**Desktop app.** Parallel chats and a visual diff panel."
```

## Check yourself

```quiz
id: what-is-codex
questions:
  - q: A colleague says "Codex is just a smarter autocomplete." Which capability best shows why that's wrong?
    options:
      - It suggests longer completions that span several functions
      - It can run commands and edit files to finish a task, then report back
      - It understands more programming languages than editor autocomplete
      - It keeps your chat history between sessions
    answer: 1
    explain: Acting on the repo (running commands, changing files, verifying) is what makes it an agent. The other options are just "better suggestions".
  - q: You want Codex to keep working on a refactor overnight while your laptop is shut. Where should you start the task?
    options: [In the CLI on your laptop, In the IDE extension, In Codex Cloud, In the desktop app on your laptop]
    answer: 2
    explain: CLI, IDE and the desktop app all run on your machine. Cloud tasks run in OpenAI's environment, independent of it.
  - q: Your CI job should ask Codex to summarise failing tests without anyone typing in a terminal. What do you use?
    options: ["`codex exec`", "`codex resume`", "The IDE extension's chat", "`codex cloud`"]
    answer: 0
    explain: "`codex exec` is the non-interactive mode built for scripts and CI. `codex resume` reopens an interactive chat."
```
